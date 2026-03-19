# Vercel Deployment

S³ treats Vercel as a **First-class** deployment target. Our `.s3` code compiles into Vercel-compatible outputs, preventing black-box hosting lock-in and avoiding custom daemon incompatibilities with Vercel's Edge/Serverless logic.

## Compiling for Vercel
When running `bun run build:vercel` or `s3 build --target vercel`, S³ behaves as a **compiler + adapter** framework. It parses your application files and either:
A. Generates standard `.vercel/output` compliant paths using the **Build Output API**.
B. Generates standard Bun/Node runtime artifacts that Vercel invokes, leveraging the `vercel.json` and custom configuration.

### One-Click Deployment
To work beautifully with tools like v0.app and native Vercel templates, S³ outputs pure Node/Bun logic. Simply push the monorepo to GitHub and import it to Vercel.

### `vercel.json` Setup
For projects, `vercel.json` configures the project to use standard commands:
```json
{
  "buildCommand": "bun run build:vercel",
  "devCommand": "bun run dev",
  "framework": "other",
  "installCommand": "bun install"
}
```
Setting `framework` to `"other"` avoids Next.js/React heuristics and allows our CLI fully to take over the Build process.

### Bun Version
S³ requires a recent version of Bun pinned via package.json or system-level CI scripts to compile the AST successfully.

### Artifacts Deployed
All routes map to serverless functions, all pages map to rendered static views or SSR endpoints, and all data abstractions compile to safe SQL or API calls within those functions.

## Limitations
Currently, S³ server-sent-events and persistent WebSocket flows are not supported optimally on Vercel without edge functions, which are planned for v2.
