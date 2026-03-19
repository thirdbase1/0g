# Generated Output rules

S⁴ is not a black-box. The compiler generates inspectable JavaScript/TypeScript output.

## Routes & Pages
`routes/hello.s4` compiles to a native `(req) => Response` handler.

## Entities
`entities/user.s4` compiles to an ORM schema (Prisma/Drizzle style).

## Flows
`flows/withdraw.s4` compiles to standard asynchronous server actions with injected dependency boundaries, meaning you can debug or test them natively.

The generated codebase inside `.vercel/output/functions` or `dist/` is heavily commented by the compiler so AI tools (like v0) and humans can directly trace bugs back to `.s4` definitions.
