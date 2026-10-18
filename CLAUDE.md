# janux-authorize.js

## Overview

Implements a permission-based authorization scheme. Provides
AuthorizationContext, Role, and Account abstractions.

## Tech Stack

- **Language**: TypeScript 2.4.2 → ES5/CommonJS
- **Build**: `tsc` via npm scripts (Gulp removed)
- **Test**: Mocha 2.4.5 + Chai 3.5.0
- **Node**: not specified in `engines`

## Exports

`AuthorizationContext`, `AuthorizationHolder`, `Role`, `Account`

Exported from the root `index.js`, which re-exports from `dist/`.

## Key Dependencies

- lodash 3.10.1
- Express 4.13.4 (devDependency)
- log4js 0.6.35
- config 1.20.1

## Build & Test

```bash
npm install
npm run build    # compiles TypeScript to dist/
npm run watch    # recompile on change
npm test         # build, then mocha
```

## Notes

- Standalone library — no internal janux dependencies.
- Output in `dist/`.
- Git branches: `develop` is the working branch and `main` is kept in step
  with it; both are on github.com/janux/janux-authorize.js.
- **Tagged `v1.0.0` on `2e447a7`**, the `gitHead` the registry records for
  the published 1.0.0. Nothing in `src/` or the compiled `dist/` has changed
  since: later commits only moved the build from gulp to `tsc` (which also
  emits `.d.ts` files), trimmed the tarball, and added docs and the MIT
  `LICENSE`. There is no 1.0.1 and no reason for one. Follow
  `/VERSIONING.md` (workspace root) for any publish.
- **TypeScript 2.4.2 is the oldest compiler in the janux set** (people is on
  3.1.8, persist on 4.9.5). 1.x stays as it is; janux 2.0 moves to
  TypeScript 5 (JAM-127).
- **lodash 3.10.1 is a runtime dependency that `npm audit` flags as critical**
  (prototype pollution, command injection). Authorize only calls type checks,
  iteration, `reduce`, `pairs`, `find`, `clone` and `isEmpty`, none of the
  vulnerable functions, so it is not exploitable through this package.
  janux 2.0 removes lodash (JAM-128).
- **The test `User` is a mixin**, not a subclass: `test/User.js` copies
  `AuthorizationHolder`'s prototype onto a plain function with
  `tools.extend`. That never runs the holder's constructor, so the fixture
  creates `permissionsGranted` itself. Without it `toJSON()`, `%j` logging
  and `hasPermissions()` throw. `tools.extend` also evaluates the lazy
  `roles` getter on the prototype, making every mixin instance share one
  roles list. No consumer uses the mixin; first-class support is JAM-130.
