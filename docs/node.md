# Node / Bun Deployment

The Node adapter compiles S³ applications directly into a Node-compatible, runnable server structure.
Use `s3 build --target node` to generate the Express/Koa/Fastify-style server output optimized for Railway, Fly.io, or VPS setups.

```json
  "build:node": "bun run packages/cli/src/index.ts build --target node"
```
