# S⁴ Framework Documentation

Welcome to S⁴! This document serves to explain exactly how you can write, learn, and master S⁴ like a pro.

## Table of Contents
1. [What is S⁴?](#what-is-s)
2. [Getting Started](#getting-started)
3. [The Core API Elements](#the-core-api-elements)
4. [Routing and Grouping](#routing-and-grouping)
5. [Handlers and Responses](#handlers-and-responses)
6. [Security by Default](#security-by-default)

---

## What is S⁴?

S⁴ provides an HTML-like developer experience built on native JSX in Bun. Instead of verbose `.use()`, `.get()`, or `.route()` chains, you build your API by nesting "tags".

Because the framework uses the `react-jsx` compiler under the hood, any `.tsx` or customized `.S⁴` file immediately becomes an intuitive web server without the boilerplate.

---

## Getting Started

1. Set up a Bun project (`bun init`).
2. Point your `tsconfig.json` `jsxImportSource` to S⁴.
3. Start writing components!

```tsx
import { start } from './src/s4';

const myApp = (
  <server port={8080}>
    <get path="/" handler={() => "Hello World"} />
  </server>
);

start(myApp);
```

---

## The Core API Elements

S⁴ operates completely via a JSX Intrinsic Component model. Think of these as actual DOM nodes, but for the backend.

### `<server>`
The root node of any S⁴ application.
- **Props:**
  - `port?: number`: Defaults to 3000.

### `<get>`, `<post>`, `<put>`, `<delete>`
These map to HTTP Verbs.
- **Props:**
  - `path: string`: The URL route (e.g., `/user/:id`).
  - `handler: Function`: The function that actually runs when the route is hit. It accepts the native `Request` object.

### `<group>`
A powerful utility to nest routes.
- **Props:**
  - `path: string`: A prefix added to all child routes.

```tsx
<group path="/v1">
  {/* Resolves to /v1/users */}
  <get path="/users" handler={...} />
</group>
```

---

## Handlers and Responses

Handlers in S⁴ are designed to stay out of your way. They are strictly typed and intelligently serialize returns.

1. **Strings:** Automatically served.
2. **Objects/Arrays:** Automatically serialized into `application/json`.
3. **Response Instances:** Passed straight through unaltered (except for adding security headers).

```tsx
<get path="/hello" handler={() => "Hi!"} />

<get path="/json" handler={() => ({ success: true, user: "Jules" })} />

<get path="/custom" handler={() => new Response("Hello", { status: 418 })} />
```

---

## Security by Default

A primary tenant of S⁴ is security. When you return *any* response (String, JSON, or Custom Object), the runtime (`src/s4/runner.ts`) passes it through our internal security pipeline (`src/s4/security.ts`).

By default, every route will return the following headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=15552000; includeSubDomains`
- `Referrer-Policy: no-referrer`
- `Access-Control-Allow-Origin: *`

No setup required!