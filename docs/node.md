# Node/Bun Deployment

When targeting `node` or a custom VPS (Railway, Render, Fly.io), the CLI generates a single optimized long-running HTTP server script.

```bash
s4 build --target node
```

This compiles your `routes`, `pages`, and `flows` directly into an Express-like but extremely minimal native Bun router, mapping all handlers directly and exposing an `index.js` (or `.ts`) entrypoint.
