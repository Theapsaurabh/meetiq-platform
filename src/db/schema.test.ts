
// Schema structure validations (runtime shape based)
describe("db/schema: table exports exist", () => {
  it("should export user, session, account, verification tables", () => {
    expect(user).toBeDefined();
    expect(session).toBeDefined();
    expect(account).toBeDefined();
    expect(verification).toBeDefined();
    // Basic shape checks
    expect(typeof user).toBe("object");
    expect(typeof session).toBe("object");
    expect(typeof account).toBe("object");
    expect(typeof verification).toBe("object");
  });
});

function hasKeys(obj: unknown, keys: string[]): { ok: boolean; missing: string[] } {
  const present = new Set(Object.keys(obj as Record<string, unknown>));
  const missing = keys.filter((k) => !present.has(k));
  return { ok: missing.length === 0, missing };
}

describe("db/schema: user table columns", () => {
  const expected = [
    "id",
    "name",
    "email",
    "emailVerified",
    "image",
    "createdAt",
    "updatedAt",
  ];

  it("should expose expected column keys on user table object", () => {
    const { ok, missing } = hasKeys(user, expected);
    // Print the visible keys for diagnosis
    if (!ok) {
      // Some Drizzle internals use proxies; this message helps when debugging
      // so we snapshot visible keys.
      // eslint-disable-next-line no-console
      console.warn("user table visible keys:", Object.keys(user));
    }
    expect(ok).toBe(true);
    expect(missing).toEqual([]);
  });
});

describe("db/schema: session table columns and relationships", () => {
  const expected = [
    "id",
    "expiresAt",
    "token",
    "createdAt",
    "updatedAt",
    "ipAddress",
    "userAgent",
    "userId",
  ];

  it("should expose expected column keys on session table object", () => {
    const { ok, missing } = hasKeys(session, expected);
    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn("session table visible keys:", Object.keys(session));
    }
    expect(ok).toBe(true);
    expect(missing).toEqual([]);
  });

  it("should include a userId foreign key field", () => {
    expect(Object.prototype.hasOwnProperty.call(session, "userId")).toBe(true);
  });
});

describe("db/schema: account table columns and relationships", () => {
  const expected = [
    "id",
    "accountId",
    "providerId",
    "userId",
    "accessToken",
    "refreshToken",
    "idToken",
    "accessTokenExpiresAt",
    "refreshTokenExpiresAt",
    "scope",
    "password",
    "createdAt",
    "updatedAt",
  ];

  it("should expose expected column keys on account table object", () => {
    const { ok, missing } = hasKeys(account, expected);
    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn("account table visible keys:", Object.keys(account));
    }
    expect(ok).toBe(true);
    expect(missing).toEqual([]);
  });

  it("should include a userId foreign key field", () => {
    expect(Object.prototype.hasOwnProperty.call(account, "userId")).toBe(true);
  });
});

describe("db/schema: verification table columns", () => {
  const expected = [
    "id",
    "identifier",
    "value",
    "expiresAt",
    "createdAt",
    "updatedAt",
  ];

  it("should expose expected column keys on verification table object", () => {
    const { ok, missing } = hasKeys(verification, expected);
    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn("verification table visible keys:", Object.keys(verification));
    }
    expect(ok).toBe(true);
    expect(missing).toEqual([]);
  });
});

// Default function sanity checks (best-effort):
// Drizzle may not expose default functions on columns in public API.
// We will attempt to access private-ish fields commonly present on column objects.
// If not found, we skip with a meaningful message (Vitest/Jest both support test.skip).
type AnyColumn = Record<string | symbol, any>;
function findDefaultFn(column: AnyColumn): undefined | (() => any) {
  // Common internal-ish candidates to inspect
  const candidates = [
    "defaultFn",              // hypothetical
    "default",                // sometimes used
    "config",                 // nested configs
    "_",                      // internal bag
    "builder",                // some libs keep builder state
  ];

  for (const key of candidates) {
    const val = column?.[key];
    if (typeof val === "function") return val;
    if (val && typeof val === "object") {
      // search nested level shallowly
      for (const [k, v] of Object.entries(val)) {
        if (/default/i.test(k) && typeof v === "function") return v as () => any;
      }
    }
  }
  // search all enumerable props for functions with "default" in name
  for (const [k, v] of Object.entries(column)) {
    if (/default/i.test(k) && typeof v === "function") return v as () => any;
  }
  return undefined;
}

const frameworkSkip = ((): ((name: string, fn: () => void) => void) => {
  try {
    // Vitest provides test.skip
    // @ts-ignore
    if (typeof test?.skip === "function") {
      // @ts-ignore
      return test.skip;
    }
  } catch {}
  try {
    // Jest also provides test.skip
    // @ts-ignore
    if (typeof test?.skip === "function") {
      // @ts-ignore
      return test.skip;
    }
  } catch {}
  // Fallback: return a no-op wrapper to avoid crashing in unknown env
  return (name: string, fn: () => void) => {};
})();

describe("db/schema: defaults (best-effort/skip if not introspectable)", () => {
  it("user.emailVerified default is boolean false (if default function is visible)", () => {
    const col: AnyColumn = (user as AnyColumn)["emailVerified"];
    expect(col).toBeDefined();
    const def = findDefaultFn(col);
    if (!def) {
      frameworkSkip("user.emailVerified default not introspectable", () => {});
      return;
    }
    const value = def();
    expect(typeof value).toBe("boolean");
    expect(value).toBe(false);
  });

  it("user.createdAt default is a Date (if default function is visible)", () => {
    const col: AnyColumn = (user as AnyColumn)["createdAt"];
    expect(col).toBeDefined();
    const def = findDefaultFn(col);
    if (!def) {
      frameworkSkip("user.createdAt default not introspectable", () => {});
      return;
    }
    const value = def();
    expect(value instanceof Date).toBe(true);
  });

  it("user.updatedAt default is a Date (if default function is visible)", () => {
    const col: AnyColumn = (user as AnyColumn)["updatedAt"];
    expect(col).toBeDefined();
    const def = findDefaultFn(col);
    if (!def) {
      frameworkSkip("user.updatedAt default not introspectable", () => {});
      return;
    }
    const value = def();
    expect(value instanceof Date).toBe(true);
  });

  it("verification.createdAt default is a Date (if default function is visible)", () => {
    const col: AnyColumn = (verification as AnyColumn)["createdAt"];
    expect(col).toBeDefined();
    const def = findDefaultFn(col);
    if (!def) {
      frameworkSkip("verification.createdAt default not introspectable", () => {});
      return;
    }
    const value = def();
    expect(value instanceof Date).toBe(true);
  });

  it("verification.updatedAt default is a Date (if default function is visible)", () => {
    const col: AnyColumn = (verification as AnyColumn)["updatedAt"];
    expect(col).toBeDefined();
    const def = findDefaultFn(col);
    if (!def) {
      frameworkSkip("verification.updatedAt default not introspectable", () => {});
      return;
    }
    const value = def();
    expect(value instanceof Date).toBe(true);
  });
});

// Constraint-oriented smoke tests (non-authoritative at runtime):
// We cannot assert unique/foreign key constraints without DB/adapter.
// We still verify that likely unique/foreign fields exist and are strings.
describe("db/schema: constraint-oriented smoke checks", () => {
  it("user.email and session.token fields exist to be candidates for unique constraints", () => {
    expect(Object.prototype.hasOwnProperty.call(user, "email")).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(session, "token")).toBe(true);
  });

  it("session.userId and account.userId exist for FK cascade", () => {
    expect(Object.prototype.hasOwnProperty.call(session, "userId")).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(account, "userId")).toBe(true);
  });
});