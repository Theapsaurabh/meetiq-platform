import { describe, it, expect } from "vitest";

// Import the config under test. Importing default export from TS config is supported by Vitest itself
// when running within Vitest environment. This spec validates critical configuration aspects.
import config from "../vitest.config";

describe("vitest.config.ts", () => {
  it("exports a config object", () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  it("has valid test configuration shape", () => {
    // test key is common; allow undefined to accommodate minimal configs but prefer presence
    // If present, it should be an object with consistent types for known fields
    if ("test" in config) {
      const t: any = (config as any).test;
      expect(typeof t).toBe("object");

      if ("environment" in t) {
        expect(typeof t.environment).toBe("string");
        // Common environments: 'node', 'jsdom', 'happy-dom'
        expect(["node", "jsdom", "happy-dom"]).toContain(t.environment);
      }

      if ("globals" in t) {
        expect(typeof t.globals).toBe("boolean");
      }

      if ("include" in t) {
        expect(Array.isArray(t.include) || typeof t.include === "string").toBe(true);
      }

      if ("exclude" in t) {
        expect(Array.isArray(t.exclude) || typeof t.exclude === "string").toBe(true);
      }

      if ("coverage" in t) {
        const c: any = t.coverage;
        expect(typeof c).toBe("object");
        if ("provider" in c) {
          // c8 is the default provider in Vitest
          expect(["c8", "istanbul"]).toContain(c.provider);
        }
        if ("enabled" in c) {
          expect(typeof c.enabled).toBe("boolean");
        }
        if ("reporter" in c) {
          expect(Array.isArray(c.reporter) || typeof c.reporter === "string").toBe(true);
        }
        if ("reportsDirectory" in c) {
          expect(typeof c.reportsDirectory).toBe("string");
          expect(c.reportsDirectory.length).toBeGreaterThan(0);
        }
        // thresholds, if provided, should be numbers
        const thresholdKeys = ["lines", "functions", "branches", "statements"];
        if (c.thresholds && typeof c.thresholds === "object") {
          for (const k of thresholdKeys) {
            if (k in c.thresholds) {
              expect(typeof c.thresholds[k]).toBe("number");
              expect(c.thresholds[k]).toBeGreaterThanOrEqual(0);
              expect(c.thresholds[k]).toBeLessThanOrEqual(100);
            }
          }
        }
      }

      if ("setupFiles" in t) {
        const s = t.setupFiles;
        expect(Array.isArray(s) || typeof s === "string").toBe(true);
      }

      if ("reporters" in t) {
        expect(Array.isArray(t.reporters) || typeof t.reporters === "string").toBe(true);
      }

      if ("watch" in t) {
        expect(typeof t.watch).toBe("boolean");
      }
    }
  });

  it("has valid resolve/alias configuration if present", () => {
    if ("resolve" in config) {
      const r: any = (config as any).resolve;
      expect(typeof r).toBe("object");
      if ("alias" in r) {
        const alias = r.alias;
        if (Array.isArray(alias)) {
          for (const entry of alias) {
            expect(typeof entry).toBe("object");
            expect(typeof entry.find === "string" || entry.find instanceof RegExp).toBe(true);
            expect(typeof entry.replacement).toBe("string");
          }
        } else if (typeof alias === "object") {
          // alias object map
          for (const [key, value] of Object.entries(alias)) {
            expect(typeof key).toBe("string");
            expect(typeof value).toBe("string");
          }
        }
      }
    }
  });

  it("has valid plugins array if present", () => {
    if ("plugins" in config) {
      const p: any = (config as any).plugins;
      expect(Array.isArray(p)).toBe(true);
      // Plugins are usually functions/objects; we just check non-null entries
      for (const plugin of p) {
        expect(plugin).toBeTruthy();
      }
    }
  });

  it("uses esbuild or tsconfig-based module resolution sensibly where provided", () => {
    if ("esbuild" in config) {
      const e: any = (config as any).esbuild;
      expect(typeof e).toBe("object");
      if ("target" in e) {
        const t = e.target;
        // Common targets: 'esnext', 'es2020', 'es2019', etc.
        expect(typeof t === "string" || Array.isArray(t)).toBe(true);
      }
      if ("jsx" in e) {
        expect(["automatic", "classic"]).toContain(e.jsx);
      }
    }
  });

  it("ensures server and optimizeDeps sections (if present) are valid", () => {
    // Since this is Vitest config, it may also carry through Vite config pieces
    if ("server" in config) {
      const s: any = (config as any).server;
      expect(typeof s).toBe("object");
      if ("port" in s) {
        expect(typeof s.port).toBe("number");
        expect(s.port).toBeGreaterThan(0);
      }
      if ("open" in s) {
        expect(typeof s.open).toBe("boolean" || typeof s.open === "string");
      }
    }
    if ("optimizeDeps" in config) {
      const o: any = (config as any).optimizeDeps;
      expect(typeof o).toBe("object");
      if ("include" in o) {
        expect(Array.isArray(o.include)).toBe(true);
      }
      if ("exclude" in o) {
        expect(Array.isArray(o.exclude)).toBe(true);
      }
    }
  });

  it("does not include obviously problematic patterns", () => {
    // Sanity checks for common pitfalls
    const asAny = config as any;

    // exclude shouldn't exclude the test file itself unless explicitly intentional;
    // ensure exclude isn't a wildcard that blocks tests
    if (asAny?.test?.exclude) {
      const ex = asAny.test.exclude;
      const list = Array.isArray(ex) ? ex : [ex];
      const flattened = list.join(" ");
      expect(flattened.includes("**/*.spec.ts")).toBe(false);
      expect(flattened.includes("**/*.test.ts")).toBe(false);
    }

    // coverage reporter shouldn't be empty if coverage.enabled is true
    const coverage = asAny?.test?.coverage;
    if (coverage?.enabled === true) {
      if ("reporter" in coverage) {
        const rep = coverage.reporter;
        const arr = Array.isArray(rep) ? rep : [rep];
        expect(arr.length).toBeGreaterThan(0);
      }
    }
  });
});