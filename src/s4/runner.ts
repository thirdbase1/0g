import { applySecurityHeaders } from './security';
import type { Handler, InternalGroup, InternalRoute } from './jsx';

type CompiledRoute = {
  method: string;
  path: string;
  handler: Handler;
};

function flattenRoutes(node: any, prefix: string = ''): CompiledRoute[] {
  const flat: CompiledRoute[] = [];

  // Extract children properly whether they are standard JSX elements or functional components
  const items = Array.isArray(node) ? node : (node.children || node.props?.children || []);

  const iterate = (nodes: any[], currentPrefix: string) => {
    for (const item of nodes) {
      if (!item) continue;

      // If it's a group
      if (item.type === 'group' || item.name === 'Group') {
         const path = item.path || item.props?.path || '';
         const children = item.children || item.props?.children || [];
         iterate(Array.isArray(children) ? children : [children], currentPrefix + path);
      }
      // If it's a route (method is present)
      else if (item.method) {
         flat.push({
           method: item.method,
           path: (currentPrefix + item.path).replace(/\/+/g, '/') || '/',
           handler: item.handler,
         });
      }
      // Or if it's a plain object that looks like a route from JSX
      else if (item.type && ['get', 'post', 'put', 'delete'].includes(item.type.toLowerCase())) {
         flat.push({
           method: item.type.toUpperCase(),
           path: (currentPrefix + item.props.path).replace(/\/+/g, '/') || '/',
           handler: item.props.handler,
         });
      }
      // Handle array of items
      else if (Array.isArray(item)) {
         iterate(item, currentPrefix);
      }
    }
  };

  // If node is an array, pass it directly, else extract children
  const nodesToIterate = Array.isArray(node) ? node : (node.props?.children || node.children || []);
  iterate(Array.isArray(nodesToIterate) ? nodesToIterate : [nodesToIterate], prefix);

  return flat;
}

export function start(app: any) {
  // Identify the server component
  const port = app.props?.port || 3000;
  const flatRoutes = flattenRoutes(app);

  const routeMap = new Map<string, Handler>();
  for (const route of flatRoutes) {
    routeMap.set(`${route.method}:${route.path}`, route.handler);
  }

  const server = Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      const method = req.method;
      const path = url.pathname;

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

  console.log(`🚀 S⁴ Server running on http://localhost:${server.port}`);
  return server;
}
