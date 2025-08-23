This repository currently has package.json-focused tests using Node's built-in test runner (node:test),
so no extra dependencies are required. Run with:

  node --test

If/when the project adopts Jest or Vitest, you can either:
- Run the same tests through an adapter (e.g., ts-jest/vitest) with minimal code changes, or
- Keep these configuration validation tests under node:test (they are dependency-free and fast).

These tests focus on configuration changes observed in the package.json diff in this PR:
- Validate scripts used by Next.js and Drizzle Kit
- Check critical dependency presence and basic compatibility (React/ReactDOM, Next, TypeScript, ESLint, Tailwind, Drizzle Kit)
- Guard against obviously invalid version strings
- Heuristic linkage between scripts and required tool packages
- Detect duplicate top-level keys (best-effort)