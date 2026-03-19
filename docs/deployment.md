# Deployment

S⁴ deploys by cross-compiling the `.s4` declarative files into standard server environments.

Your primary targets:
- `vercel` (Default)
- `node` (Bun/Node compatible server)

To deploy:
```bash
s4 build --target vercel
s4 build --target node
```
