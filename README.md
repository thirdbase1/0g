# S³ (Sora) Framework

**Simple to write. Fast to run. Safe by default.**

S³ (pronounced "Sora") is a custom web framework designed for maximum developer experience with an emphasis on speed, simplicity, and security.

## Philosophy
S³ believes that code should be easy to read and safe to run. We offer a completely custom indentation-based DSL (.s3) that removes boilerplate while providing strong guarantees out of the box. The focus is to compile this simple declarative representation into blazing-fast generated code running on Node.js or Bun.

The ".s3" extension stands for our identity: **Speed. Simplicity. Security.**

## Why a custom DSL?
To free the developer from verbose JS or curly-brace soup. S³ code looks like readable markup but creates powerful web backends securely.

## Quickstart

```bash
bun install
bun run dev
```

## Sample Syntax

```s3
app "WalletX"
  runtime bun
  adapter vercel
  auth session

  security
    csrf on
    xss escape
    headers secure
    rate default 60/min
```

## CLI Usage

```bash
# Start the local development server
bun run dev

# Build for Vercel
bun run build:vercel

# Build for Node
bun run build:node
```

## Deployment Targets
- Vercel (First-class target via custom build scripts or Build Output API)
- Node/Bun server for VPS/Docker setups

## Documentation
- [Introduction](docs/introduction.md)
- [Philosophy](docs/philosophy.md)
- [Syntax](docs/syntax.md)
- [Security](docs/security.md)
- [Deployment](docs/deployment.md)

## Examples
- [Hello World](examples/hello-world)
- [Basic Auth](examples/auth-basic)
- [Wallet Starter](examples/wallet-starter)
- [Vercel Demo](examples/vercel-demo)
