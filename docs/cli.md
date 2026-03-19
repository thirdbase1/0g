# S³ CLI

The S³ CLI is invoked with `bun run packages/cli/src/index.ts`.
You can bind `npx s3` or `bunx s3` if distributed.

### dev
Starts the local development server parsing and watching `.s3` files.
`s3 dev [path]`

### build
Compiles `.s3` into runtime components and deploys to targets.
`s3 build --target <vercel|node> [path]`

### new
Scaffolds a new starter application.
`s3 new <name>`
