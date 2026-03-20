import { bench, run } from "mitata";
import { serve } from "bun";

const server = serve({
  port: 3001,
  fetch(req) {
    if (new URL(req.url).pathname === '/hello') {
      return new Response(JSON.stringify({ hello: 'world' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
});

console.log(`PulseStack Route Benchmark Server running at ${server.url}`);

bench("Raw JSON Route", async () => {
  const res = await fetch(`http://localhost:3001/hello`);
  await res.json();
});

await run();

server.stop();
