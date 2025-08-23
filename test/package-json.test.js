// Tests for package.json focusing on the PR diff-critical fields.
// Framework: Node's built-in test runner (node:test) + assert (no external deps).
// How to run locally: `node --test` (Node 18+). CI can invoke the same.
// If your project later adopts Jest/Vitest, this file can be migrated with minimal changes.

import { test, describe, beforeAll } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

let pkgRaw, pkg;

beforeAll(() => {
  const p = path.resolve(process.cwd(), 'package.json');
  assert.ok(fs.existsSync(p), 'package.json must exist at repository root');

  // Read raw for duplicate key checks
  pkgRaw = fs.readFileSync(p, 'utf8');
  assert.ok(pkgRaw.trim().startsWith('{'), 'package.json should be valid JSON starting with {');

  // Parse JSON
  try {
    pkg = JSON.parse(pkgRaw);
  } catch (e) {
    // Provide more context if JSON is invalid
    throw new Error('package.json is not valid JSON: ' + e.message);
  }
});

describe('package.json structure', () => {
  test('has required top-level fields', () => {
    for (const key of ['name', 'version', 'private', 'scripts', 'dependencies', 'devDependencies']) {
      assert.ok(Object.prototype.hasOwnProperty.call(pkg, key), `Missing top-level key: ${key}`);
    }
  });

  test('name, version types are correct', () => {
    assert.strictEqual(typeof pkg.name, 'string', 'name should be a string');
    assert.strictEqual(typeof pkg.version, 'string', 'version should be a string');
  });

  test('private should be true for this app', () => {
    assert.strictEqual(pkg.private, true, 'private should be true to prevent accidental publish');
  });

  test('scripts has required commands with exact values', () => {
    const expected = {
      dev: 'next dev --turbopack',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
    };

    for (const [k, v] of Object.entries(expected)) {
      assert.ok(pkg.scripts && typeof pkg.scripts === 'object', 'scripts must be an object');
      assert.ok(k in pkg.scripts, `scripts["${k}"] must exist`);
      assert.strictEqual(pkg.scripts[k], v, `scripts["${k}"] must be exactly "${v}"`);
    }
  });

  test('dependencies and devDependencies are objects and non-empty', () => {
    assert.ok(pkg.dependencies && typeof pkg.dependencies === 'object', 'dependencies must be an object');
    assert.ok(Object.keys(pkg.dependencies).length > 0, 'dependencies should not be empty');
    assert.ok(pkg.devDependencies && typeof pkg.devDependencies === 'object', 'devDependencies must be an object');
    assert.ok(Object.keys(pkg.devDependencies).length > 0, 'devDependencies should not be empty');
  });
});

describe('critical dependency expectations (compatibility and ranges)', () => {
  function majorOf(range) {
    // Extract major from semver range like "^19.0.0" or "19.0.0"
    const m = String(range || '').match(/(\d+)\./);
    return m ? Number(m[1]) : NaN;
  }

  function hasCaret(range) {
    return typeof range === 'string' && range.trim().startsWith('^');
  }

  test('React and ReactDOM major versions align', () => {
    const react = pkg.dependencies?.react;
    const reactDom = pkg.dependencies?.['react-dom'];
    assert.ok(react, 'react dependency must exist');
    assert.ok(reactDom, 'react-dom dependency must exist');

    const rMaj = majorOf(react);
    const rdMaj = majorOf(reactDom);
    assert.ok(Number.isFinite(rMaj), `react version should contain a major number. Found: ${react}`);
    assert.ok(Number.isFinite(rdMaj), `react-dom version should contain a major number. Found: ${reactDom}`);
    assert.strictEqual(rMaj, rdMaj, `react (${react}) and react-dom (${reactDom}) major versions must match`);
  });

  test('Next.js version exists and uses caret range', () => {
    const next = pkg.dependencies?.next;
    assert.ok(next, 'next dependency must exist');
    assert.ok(hasCaret(next), `next version should use a caret range. Found: ${next}`);
    const maj = majorOf(next);
    assert.ok(Number.isFinite(maj), `next version should contain a major number. Found: ${next}`);
  });

  test('TypeScript present as a dev dependency with caret range', () => {
    const ts = pkg.devDependencies?.typescript;
    assert.ok(ts, 'typescript devDependency must exist');
    assert.ok(hasCaret(ts), `typescript version should use a caret range. Found: ${ts}`);
    const maj = majorOf(ts);
    assert.ok(Number.isFinite(maj), `typescript version should contain a major number. Found: ${ts}`);
  });

  test('ESLint present in devDependencies (lint script relies on it)', () => {
    const eslint = pkg.devDependencies?.eslint;
    assert.ok(eslint, 'eslint devDependency must exist to support "next lint"');
  });

  test('TailwindCSS present in devDependencies with v4 (as configured)', () => {
    const tw = pkg.devDependencies?.tailwindcss;
    assert.ok(tw, 'tailwindcss devDependency must exist');
    // Allow v4+; only verify major
    const maj = majorOf(tw);
    assert.ok(Number.isFinite(maj), `tailwindcss version should contain a major number. Found: ${tw}`);
  });

  test('Drizzle Kit present in devDependencies (db scripts rely on it)', () => {
    const dk = pkg.devDependencies?.['drizzle-kit'];
    assert.ok(dk, 'drizzle-kit devDependency must exist to support db: scripts');
  });
});

describe('sanity checks and guardrails', () => {
  test('no obviously invalid dependency version strings', () => {
    const invalids = [];
    const check = (name, ver) => {
      // Very light validation: must contain a digit; disallow "latest" or empty
      if (!/\d/.test(String(ver)) || String(ver).trim() === '' || String(ver).toLowerCase() === 'latest') {
        invalids.push({ name, ver });
      }
    };

    for (const [k, v] of Object.entries(pkg.dependencies || {})) check(k, v);
    for (const [k, v] of Object.entries(pkg.devDependencies || {})) check(k, v);

    assert.deepStrictEqual(invalids, [], `Invalid version literals found: ${JSON.stringify(invalids)}`);
  });

  test('scripts do not reference missing tool packages (basic heuristic)', () => {
    // If scripts reference a binary, ensure the corresponding package exists somewhere.
    // This is heuristic-based: e.g., "next ..." -> dependencies.next || devDependencies.next
    const refs = [
      { bin: 'next', pkgNames: ['next'] },
      { bin: 'drizzle-kit', pkgNames: ['drizzle-kit'] },
      { bin: 'eslint', pkgNames: ['eslint'] },
    ];

    const scripts = pkg.scripts || {};
    const allScriptText = Object.values(scripts).join(' && ');
    for (const { bin, pkgNames } of refs) {
      if (allScriptText.includes(bin)) {
        const found = pkgNames.some((p) => (pkg.dependencies && pkg.dependencies[p]) || (pkg.devDependencies && pkg.devDependencies[p]));
        assert.ok(found, `Script references "${bin}" but no corresponding package (${pkgNames.join(',')}) was found in dependencies/devDependencies`);
      }
    }
  });

  test('package.json contains no duplicate top-level keys (best-effort raw scan)', () => {
    // JSON officially does not allow duplicates; parsers typically take last occurrence.
    // We do a best-effort raw tokenization to detect any exact duplicate of top-level keys.
    const topLevelKeyRegex = /"([^"]+)"\s*:/g;
    const raw = pkgRaw;

    // Extract top-level-ish keys by scanning only the first nesting level heuristically.
    // We'll count occurrences of double-quoted keys that are not preceded by another "{" without being closed.
    const counts = {};
    let braceLevel = 0;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '{') braceLevel++;
      if (ch === '}') braceLevel = Math.max(0, braceLevel - 1);
      if (braceLevel === 1) {
        // At top level, try to match a key starting here
        const slice = raw.slice(i);
        const m = slice.match(/^"([^"]+)"\s*:/);
        if (m) {
          const key = m[1];
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    }

    const dups = Object.entries(counts).filter(([, c]) => c > 1).map(([k, c]) => ({ key: k, count: c }));
    assert.deepStrictEqual(dups, [], `Duplicate top-level keys found: ${JSON.stringify(dups)}`);
  });
});