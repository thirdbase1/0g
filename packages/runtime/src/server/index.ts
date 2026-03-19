export type Handler = (req: Request) => Response | Promise<Response>;

export class S4Server {
  private routes = new Map<string, Handler>();
  private port = 3000;

  public secureHeaders = true;
  public escapeXSS = true;

  constructor(options?: { port?: number, secureHeaders?: boolean, escapeXSS?: boolean }) {
    if (options?.port) this.port = options.port;
    if (options?.secureHeaders !== undefined) this.secureHeaders = options.secureHeaders;
    if (options?.escapeXSS !== undefined) this.escapeXSS = options.escapeXSS;
  }

  public register(method: string, path: string, handler: Handler) {
    this.routes.set(`${method.toUpperCase()}:${path}`, handler);
  }

  private applySecurity(res: Response): Response {
    if (!this.secureHeaders) return res;

    const headers = new Headers(res.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    headers.set('Referrer-Policy', 'no-referrer');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers
    });
  }

  public start() {
    const self = this;
    const server = Bun.serve({
      port: this.port,
      fetch(req) {
        const url = new URL(req.url);
        const routeKey = `${req.method}:${url.pathname}`;

        const handler = self.routes.get(routeKey);
        let res: Response;

        if (handler) {
          try {
            const rawRes = handler(req) as Response;
            res = rawRes instanceof Promise ? rawRes : Promise.resolve(rawRes) as any;
          } catch (e) {
            console.error(e);
            res = new Response("Internal Server Error", { status: 500 });
          }
        } else {
          res = new Response("Not Found", { status: 404 });
        }

        return res instanceof Promise
           ? res.then(r => self.applySecurity(r))
           : self.applySecurity(res);
      }
    });

    console.log(`🚀 S⁴ Server running on http://localhost:${server.port}`);
    return server;
  }
}
