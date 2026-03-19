export type Handler = (req: Request) => Response | Promise<Response> | any;

export type Route = {
  method: string;
  path: string;
  handler: Handler;
};

export type RouteGroup = {
  prefix: string;
  routes: (Route | RouteGroup)[];
};

export type ServerOptions = {
  port?: number;
  middleware?: Array<(req: Request) => Response | Promise<Response> | void | Promise<void>>;
};

function flattenRoutes(routes: (Route | RouteGroup)[], prefix: string = ''): Route[] {
  const flat: Route[] = [];
  for (const item of routes) {
    if ('prefix' in item) {
      flat.push(...flattenRoutes(item.routes, prefix + item.prefix));
    } else {
      flat.push({
        method: item.method,
        path: (prefix + item.path).replace(/\/+/g, '/') || '/',
        handler: item.handler,
      });
    }
  }
  return flat;
}

export function Get(path: string, handler: Handler): Route {
  return { method: 'GET', path, handler };
}

export function Post(path: string, handler: Handler): Route {
  return { method: 'POST', path, handler };
}

export function Put(path: string, handler: Handler): Route {
  return { method: 'PUT', path, handler };
}

export function Delete(path: string, handler: Handler): Route {
  return { method: 'DELETE', path, handler };
}

export function Group(prefix: string, routes: (Route | RouteGroup)[]): RouteGroup {
  return { prefix, routes };
}

import { applySecurityHeaders } from './security';

export function Server(options: ServerOptions, routes: (Route | RouteGroup)[]) {
  const flatRoutes = flattenRoutes(routes);

  // Fast route matching using a simple map for exact matches for extreme speed.
  // In a real robust framework, we'd use a radix tree for parameters.
  // For this "simpleness" and "speed" requirement, we'll keep it as fast as possible.
  const routeMap = new Map<string, Handler>();
  for (const route of flatRoutes) {
    routeMap.set(`${route.method}:${route.path}`, route.handler);
  }

  const port = options.port || 3000;

  const server = Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      const method = req.method;
      const path = url.pathname;

      if (options.middleware) {
        for (const mw of options.middleware) {
          const mwRes = await mw(req);
          if (mwRes instanceof Response) {
            return mwRes; // Short circuit
          }
        }
      }

      const handler = routeMap.get(`${method}:${path}`);

      let response: Response;

      if (handler) {
        try {
          const result = await handler(req);
          if (result instanceof Response) {
             response = result;
          } else if (typeof result === 'object') {
             response = Response.json(result);
          } else {
             response = new Response(String(result));
          }
        } catch (e) {
          console.error(e);
          response = new Response('Internal Server Error', { status: 500 });
        }
      } else {
        response = new Response('Not Found', { status: 404 });
      }

      return applySecurityHeaders(response);
    },
  });

  console.log(`🚀 Nexa Server running on http://localhost:${server.port}`);
  return server;
}
