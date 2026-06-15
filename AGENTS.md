# AGENTS.md

## Cursor Cloud specific instructions

### What this repository is

This repo currently contains a single committed artifact: `debug-3.2.6.tgz`, the
published npm package source for the [`debug`](https://www.npmjs.com/package/debug)
logging library (version 3.2.6). There is **no root `package.json`, no build, and
no test suite checked in** — the published tarball intentionally ships only the
distributable `src/`, `dist/`, `node.js`, `README.md`, and `LICENSE` (its
`package.json` has no `scripts` and no test files). So there is nothing to lint,
build, or unit-test from the repo itself.

The "application" here is the `debug` library. The meaningful way to verify the
environment is to consume the tarball from a small Node project and confirm the
debug output behaves correctly.

### Toolchain

- Node.js (v22) and npm are preinstalled in the base image; nothing else is needed.

### Dev sandbox (created by the startup update script)

The update script installs the committed tarball into a throwaway consumer at
`~/debug-sandbox` (outside the repo, so it never dirties git). After startup you
can immediately use it:

```bash
node ~/debug-sandbox/hello.js                 # debug output suppressed
DEBUG='app:*' node ~/debug-sandbox/hello.js   # debug namespaces print
```

The sandbox install is idempotent and is guarded on `debug-3.2.6.tgz` existing,
so it is safe even if this branch's changes are not merged.

### Gotchas

- `debug` writes to **stderr** by default in Node and only prints namespaces that
  match the `DEBUG` env var (e.g. `DEBUG=app:*`). With no `DEBUG` set, debug
  output is silent — that is expected, not a failure.
- `npm install <tgz>` prints an npm "issues need review / npm audit" notice; this
  is advisory only and not an install failure.
