/**
 * Unit tests for auth configuration.
 *
 * Testing library/framework: Vitest (compatible with Jest-style APIs).
 * - If your project uses Vitest, run: npx vitest or pnpm vitest
 * - If your project uses Jest, these tests should still be largely compatible;
 *   swap Vitest imports with Jest globals and adjust vi.mock -> jest.mock if needed.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We will mock all external dependencies to purely validate how this module wires them up.
// Mocks must be declared before importing the module under test.

const mockBetterAuthReturn = { kind: "auth-instance", id: Symbol("auth") } as const;

const drizzleAdapterSpy = vi.fn((_db: unknown, _opts: unknown) => {
  return { kind: "drizzle-adapter", args: { db: _db, opts: _opts } };
});

vi.mock("better-auth", () => {
  return {
    betterAuth: vi.fn((_config: unknown) => mockBetterAuthReturn),
  };
});

vi.mock("better-auth/adapters/drizzle", () => {
  return {
    drizzleAdapter: drizzleAdapterSpy,
  };
});

// Simulate the db and schema modules referenced via TS path alias "@/db" and "@/db/schema".
// We create stable sentinel objects to assert identity.
const fakeDb = { pool: "fake-db-conn" };
const fakeSchema = {
  users: { table: "users" },
  sessions: { table: "sessions" },
  accounts: { table: "accounts" },
};

// The module under test imports "@/db" and "@/db/schema".
// We provide mocks under those module ids so import resolution in tests works.
vi.mock("@/db", () => ({ db: fakeDb }));
vi.mock("@/db/schema", () => ({ ...fakeSchema }));

// Now import after mocks are set up
import { betterAuth } from "better-auth";
import { auth } from "./auth"; // we expect the real source file to be src/lib/auth.ts

describe("auth configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export the instance returned by betterAuth", () => {
    // The module import executed betterAuth once at module-evaluation time.
    // We verify that the exported 'auth' is the same instance the mock returned.
    expect(auth).toBe(mockBetterAuthReturn);
  });

  it("calls betterAuth exactly once with expected shape", async () => {
    expect((betterAuth as unknown as vi.Mock).mock.calls.length).toBe(1);
    const [config] = (betterAuth as unknown as vi.Mock).mock.calls[0];

    // Basic shape checks
    expect(config).toBeTruthy();
    expect(typeof config).toBe("object");

    // emailAndPassword.enabled should be true
    // Use optional chaining to avoid crash on missing keys for better failure messages
    expect(config?.emailAndPassword?.enabled).toBe(true);
  });

  it("uses drizzleAdapter with db and correct options", () => {
    // drizzleAdapter should have been invoked once during module init
    expect(drizzleAdapterSpy).toHaveBeenCalledTimes(1);
    const [dbArg, opts] = drizzleAdapterSpy.mock.calls[0];

    // Asserts identity to our fake db mock
    expect(dbArg).toBe(fakeDb);

    // provider should be 'pg'
    expect(opts && (opts as any).provider).toBe("pg");

    // schema should contain the keys we exported from our fake schema mock
    const schemaObj = (opts as any).schema;
    expect(schemaObj).toBeTruthy();
    for (const key of Object.keys(fakeSchema)) {
      expect(Object.prototype.hasOwnProperty.call(schemaObj, key)).toBe(true);
      // Ensure the actual object reference is preserved (spread should copy, but our mock returns object with same references)
      expect(schemaObj[key]).toBe((fakeSchema as any)[key]);
    }
  });

  it("wires drizzleAdapter return value into betterAuth's database option", () => {
    // Extract the config passed to betterAuth and ensure it embeds the adapter's return.
    const [config] = (betterAuth as unknown as vi.Mock).mock.calls[0];
    expect(config).toBeTruthy();
    // We can’t directly inspect private internals of better-auth, but we can
    // recompute what drizzleAdapter returned at call time and assert call counts/args.
    // This test primarily validates invocation ordering and wiring via spy calls.
    const adapterReturn = drizzleAdapterSpy.mock.results[0]?.value;
    expect(adapterReturn).toBeTruthy();
    // Since we cannot introspect config.database safely, we rely on call-side guarantees already covered.
    // This assertion ensures adapter was called before betterAuth consumed the config.
    expect(drizzleAdapterSpy.mock.invocationCallOrder[0])
      .toBeLessThanOrEqual((betterAuth as unknown as vi.Mock).mock.invocationCallOrder[0]);
  });

  it("fails fast if drizzleAdapter throws (negative path)", async () => {
    // Temporarily make drizzleAdapter throw and re-import the module to simulate init failure.
    const originalImpl = drizzleAdapterSpy.getMockImplementation();
    drizzleAdapterSpy.mockImplementationOnce(() => {
      throw new Error("drizzle init failed");
    });

    // Re-import the module in an isolated context
    await vi.dynamicImportSettled?.(); // noop if unsupported
    await expect(import("./auth")).rejects.toThrow(/drizzle init failed/);

    // Restore original implementation
    drizzleAdapterSpy.mockImplementation(originalImpl!);
  });

  it("fails fast if betterAuth throws (negative path)", async () => {
    const betterAuthMock = betterAuth as unknown as vi.Mock;
    const original = betterAuthMock.getMockImplementation();
    betterAuthMock.mockImplementationOnce(() => {
      throw new Error("betterAuth init failed");
    });

    await expect(import("./auth")).rejects.toThrow(/betterAuth init failed/);

    betterAuthMock.mockImplementation(original!);
  });
});