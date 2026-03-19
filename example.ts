import { Server, Get, Post, Group } from './src/nexa';

// A simple declarative "HTML-like" tree for routing
Server({ port: 3000 }, [
  // Root
  Get('/', () => "Welcome to Nexa! Lightning Fast & Simple."),

  // HTML-like string return
  Get('/html', () => new Response("<h1>Hello World</h1>", { headers: { "Content-Type": "text/html" }})),

  // API grouping
  Group('/api', [
    Get('/status', () => ({ status: "ok", uptime: process.uptime() })),
    Get('/users', () => [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ]),
    Post('/users', async (req) => {
      // Echo back what was sent
      const body = await req.json();
      return { created: true, data: body };
    })
  ])
]);
