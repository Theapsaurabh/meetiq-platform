/**
 * Test framework: Vitest
 * Purpose: Validate initialization and export behavior of src/lib/auth-client.ts.
 * Strategy:
 *  - Mock "better-auth/react" to observe createAuthClient calls and avoid side effects.
 *  - Verify export value, config forwarding, error propagation, and module cache behavior.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the external dependency
vi.mock("better-auth/react", () => {
  return {
    createAuthClient: vi.fn()
  }
})

const modulePath = "./auth-client"

describe("src/lib/auth-client (Vitest)", () => {
  beforeEach(() => {
    // Reset the module registry and mocks for clean imports per test
    vi.resetModules()
    vi.clearAllMocks()
  })

  it("exports an authClient created by createAuthClient (happy path)", async () => {
    const { createAuthClient } = await import("better-auth/react")
    const fakeClient = { signIn: vi.fn(), signOut: vi.fn(), session: null }
    ;(createAuthClient as any).mockReturnValue(fakeClient)

    const mod = await import(modulePath)

    expect((createAuthClient as any)).toHaveBeenCalledTimes(1)
    expect(mod.authClient).toBe(fakeClient)
    expect(typeof mod.authClient).toBe("object")
    expect(typeof (mod.authClient as any).signIn).toBe("function")
    expect(typeof (mod.authClient as any).signOut).toBe("function")
  })

  it("forwards the configuration object to createAuthClient (currently empty {})", async () => {
    const { createAuthClient } = await import("better-auth/react")
    ;(createAuthClient as any).mockReturnValue({})

    await import(modulePath)

    expect((createAuthClient as any)).toHaveBeenCalledTimes(1)
    const [cfg] = (createAuthClient as any).mock.calls[0]
    expect(typeof cfg).toBe("object")
    // The implementation currently passes an empty object; this assertion will
    // catch regressions if defaults are unintentionally changed.
    expect(cfg).toStrictEqual({})
  })

  it("propagates errors thrown by createAuthClient during module initialization", async () => {
    const { createAuthClient } = await import("better-auth/react")
    const err = new Error("boom")
    ;(createAuthClient as any).mockImplementation(() => { throw err })

    await expect(import(modulePath)).rejects.toThrow("boom")
  })

  it("does not re-initialize on subsequent cached imports (module cache behavior)", async () => {
    const { createAuthClient } = await import("better-auth/react")
    ;(createAuthClient as any).mockReturnValue({})

    const mod1 = await import(modulePath)
    expect((createAuthClient as any)).toHaveBeenCalledTimes(1)

    // Import again without resetting module registry: should use cache
    const mod2 = await import(modulePath)
    expect((createAuthClient as any)).toHaveBeenCalledTimes(1)
    expect(mod2.authClient).toBe(mod1.authClient)
  })
})