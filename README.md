# S⁴ Framework

**Speed. Simplicity. Security.**
*Simple to write. Fast to run. Safe by default.*

S⁴ (pronounced "Sora") is a revolutionary custom web framework built on a beginner-friendly, indentation-based DSL that feels as easy to read as HTML, but prioritizes modern server-side safety and execution speed on Bun.

## Philosophy

The file extension is `.s4`, but we call it **S⁴**.
We believe you shouldn't have to write verbose JavaScript or deal with complex React/JSX setups to build robust APIs, pages, and data flows. S⁴ uses a simple declarative language that compiles down to highly optimized native Bun runtime output, ready for Vercel out of the box.

## Quickstart

```bash
# Create a new app
bun run packages/cli/src/index.ts new my-app

# Run the dev server
bun run dev

# Deploy to Vercel
bun run build:vercel
```

## Documentation

See the [docs folder](./docs) for detailed guides on syntax, security, and deployment targets.

## Examples

- [Hello World](./examples/hello-world)
- [Auth Basic](./examples/auth-basic)
- [Wallet Starter](./examples/wallet-starter)
