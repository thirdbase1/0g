export type Handler = (req: Request) => Response | Promise<Response> | any;

export type RouteProps = {
  path: string;
  handler: Handler;
};

export type GroupProps = {
  path: string;
  children: any;
};

export type ServerProps = {
  port?: number;
  children: any;
};

export function jsx(type: any, props: any, key: any) {
  return { type, props };
}

export function jsxs(type: any, props: any, key: any) {
  return { type, props };
}

export function Fragment(props: any) {
  return props.children;
}

// Make them available globally or via import for JSX typescript definitions
export declare namespace JSX {
  interface IntrinsicElements {
    server: ServerProps;
    group: GroupProps;
    get: RouteProps;
    post: RouteProps;
    put: RouteProps;
    delete: RouteProps;
  }
}
