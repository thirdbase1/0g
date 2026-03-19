# S⁴ - The Next Generation Web Framework

S⁴ stands for **S**peed, **S**impleness, **S**ecurity, and **S**calability.
It is an ultra-fast web framework built uniquely on top of Bun, leveraging a revolutionary "HTML-like" syntax.

## The Philosophy

When we built S⁴, we had one simple question in mind: *What if writing backend routing was as simple as nesting HTML tags?*

1. **Speed:** Built inherently on `Bun.serve()`, bypassing the overhead of traditional node frameworks.
2. **Simpleness:** Written via standard JSX trees. If you can write `<div><p>Hello</p></div>`, you can write an S⁴ server.
3. **Security:** Every response is automatically intercepted and enhanced with robust HTTP headers akin to industry-standard tools like Helmet.

## Example

Take a look at `example.S⁴` to see it in action:

```tsx
import { start } from './src/s4';

const app = (
  <server port={3000}>
    <get path="/" handler={() => "Lightning Fast & Simple."} />

    <group path="/api">
      <get path="/status" handler={() => ({ ok: true })} />
    </group>
  </server>
);

start(app);
```

To run your code, since Bun understands JSX natively, you can simply run it directly!

```bash
bun run example.S⁴
```

Read [DOCS.md](./DOCS.md) for a deep dive, or check out [BENCHMARKS.md](./BENCHMARKS.md) to see just how fast we are.
