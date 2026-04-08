# Introduction

Welcome to S⁴. This is an ultra-fast, radically simplified web framework built around a declarative `.s4` DSL.

S⁴ compiles the DSL ahead-of-time (AOT) down into an optimized Bun native or Vercel edge/serverless function output. It avoids the overhead of runtime routing by statically resolving dependencies.

## Setup

Use our CLI:
```bash
s4 new my-app
s4 dev
s4 build --target vercel
```
