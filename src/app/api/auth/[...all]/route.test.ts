// Unit tests for src/app/api/auth/[...all]/route.ts
// Framework compatibility: Jest or Vitest (no new deps introduced)

import type { Request as NodeRequest } from "node-fetch"; // type-only safety if available

// Framework-agnostic mocking helpers
// Prefer Vitest's vi if present; fall back to Jest's jest in Jest envs.
const anyGlobal: any = globalThis as any;
const viLike = anyGlobal.vi ?? anyGlobal.jest;
const jestLike = anyGlobal.jest ?? anyGlobal.vi;

if (!viLike || !jestLike) {
  // Soft fallback for environments that expose only one of them under a different name
  (globalThis as any).vi = viLike ?? anyGlobal.jest;
  (globalThis as any).jest = jestLike ?? anyGlobal.vi;
}

// Create spies/stubs we can swap per test
const stubGet = (viLike?.fn?.() ?? jestLike?.fn?.()) as unknown as (req: Request) => Promise<Response> | Response;
const stubPost = (viLike?.fn?.() ?? jestLike?.fn?.()) as unknown as (req: Request) => Promise<Response> | Response;

// Sentinel auth object to verify it is passed to toNextJsHandler
const AUTH_SENTINEL = { __brand: "auth_sentinel" } as const;

// Mock better-auth/next-js to control toNextJsHandler return
viLike?.mock?.("better-auth/next-js", () => {
  return {
    // factory returns an object with GET and POST stubs; capture last args for assertions
    toNextJsHandler: viLike.fn((authArg: unknown) => {
      (toNextJsHandler as any).__lastArgs = [authArg];
      return { GET: stubGet, POST: stubPost };
    }),
  };
});

// Mock @/lib/auth to export our sentinel
viLike?.mock?.("@/lib/auth", () => {
  return { auth: AUTH_SENTINEL };
});

// Import module under test AFTER mocks are set up
import { POST, GET } from "./route";
import { toNextJsHandler } from "better-auth/next-js";

describe("Auth route handler (src/app/api/auth/[...all]/route.ts)", () => {
  beforeEach(() => {
    viLike?.clearAllMocks?.();
    // Re-wire stubs since we've aliased them outside
    (stubGet as any).mockReset?.();
    (stubPost as any).mockReset?.();
  });

  it("should export GET and POST handlers as functions", () => {
    expect(typeof GET).toBe("function");
    expect(typeof POST).toBe("function");
  });

  it("should initialize handlers by calling toNextJsHandler with the imported auth object", () => {
    // Module import happens at file load; assert call happened with our sentinel
    const lastArgs = (toNextJsHandler as any).__lastArgs;
    expect(lastArgs).toBeDefined();
    expect(lastArgs[0]).toBe(AUTH_SENTINEL);
  });

  it("GET should delegate to underlying handler and return its Response (happy path)", async () => {
    const req = new Request("http://localhost/api/auth?x=1", { method: "GET", headers: { "x-test": "yes" } });

    const expected = new Response("ok-get", { status: 200, headers: { "content-type": "text/plain" } });
    (stubGet as any).mockImplementation((r: Request) => {
      // verify the same Request instance is forwarded
      expect(r).toBe(req);
      return expected;
    });

    const res = await (GET as any)(req);
    expect(res).toBe(expected);
    expect((stubGet as any)).toHaveBeenCalledTimes(1);
    expect((stubGet as any)).toHaveBeenCalledWith(req);
  });

  it("POST should delegate to underlying handler and return its Response (happy path)", async () => {
    const req = new Request("http://localhost/api/auth", { method: "POST", body: JSON.stringify({ a: 1 }) });

    const expected = new Response(JSON.stringify({ ok: true }), { status: 201, headers: { "content-type": "application/json" } });
    (stubPost as any).mockImplementation((r: Request) => expected);

    const res = await (POST as any)(req);
    expect(res).toBe(expected);
    expect((stubPost as any)).toHaveBeenCalledTimes(1);
    expect((stubPost as any)).toHaveBeenCalledWith(req);
  });

  it("GET should propagate errors thrown by the underlying handler", async () => {
    const req = new Request("http://localhost/api/auth", { method: "GET" });
    const err = new Error("boom-get");
    (stubGet as any).mockImplementation(() => { throw err; });

    await expect((GET as any)(req)).rejects.toBe(err);
    expect((stubGet as any)).toHaveBeenCalledTimes(1);
  });

  it("POST should propagate errors thrown by the underlying handler", async () => {
    const req = new Request("http://localhost/api/auth", { method: "POST" });
    const err = new Error("boom-post");
    (stubPost as any).mockImplementation(() => { throw err; });

    await expect((POST as any)(req)).rejects.toBe(err);
    expect((stubPost as any)).toHaveBeenCalledTimes(1);
  });

  it("should handle unexpected inputs gracefully by passing any Request-like object through", async () => {
    // Create a minimal Request-like object; underlying stub should still receive it
    const minimalReq: any = { url: "http://localhost/api/auth", method: "GET" };
    const expected = new Response("ok-minimal");
    (stubGet as any).mockResolvedValue(expected);

    const res = await (GET as any)(minimalReq);
    expect(res).toBe(expected);
    expect((stubGet as any)).toHaveBeenCalledWith(minimalReq);
  });
});