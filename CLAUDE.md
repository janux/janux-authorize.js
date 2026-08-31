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
- Git branch: `develop`, remote: github.com/janux/janux-authorize.js
- Not yet tagged for a published version (the currently-published `1.0.0`
  predates this convention). Follow `/VERSIONING.md` (workspace root) for
  any future publish, including tagging the final published commit
  `vX.Y.Z`.
- **TypeScript 2.4.2 is the oldest compiler in the janux set** (people is on
  3.1.8, persist on 4.9.5). Standardizing all three is planned as part of the
  Node 12 baseline work.
- There is an unmerged `origin/jl-1808-updateNode12` branch from 2021
  (2 commits: Node 12 build update, remove lodash) relevant to that work.
