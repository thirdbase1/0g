# Vercel Deployment

S⁴ is Vercel-first. The Vercel adapter emits a Vercel-compatible build output API structure or provides a fallback via custom build settings and a `vercel.json` file.

## Build Output API
When you run `s4 build --target vercel`, the CLI parses the `.s4` pages and routes into serverless functions (`.func`) inside `.vercel/output/functions`. Static assets go into `.vercel/output/static`. This provides absolute zero-config Vercel compatibility.

## `vercel.json` and Framework "Other"
For legacy setups, S⁴ can operate as an "Other" framework utilizing:
```json
{
  "buildCommand": "bun run build:vercel",
  "devCommand": "bun run dev"
}
```
Vercel pin: Bun version is determined by the pinned version inside `bunfig.toml` or `package.json`.
