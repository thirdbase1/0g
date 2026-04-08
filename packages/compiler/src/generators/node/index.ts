import { ASTNode, AppAST, RouteAST, PageAST, UIElement } from '../../ast/index.js';

function camelToKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function renderStyles(styles: Record<string, any>) {
  if (Object.keys(styles).length === 0) return '';
  const css = Object.entries(styles).map(([k, v]) => `${camelToKebab(k)}: ${v}`).join('; ');
  return ` style="${css}"`;
}

function renderUIElement(el: UIElement): string {
  let html = '';

  if (el.type === 'row') {
    el.styles.display = 'flex';
    el.styles.flexDirection = 'row';
    html += `<div${renderStyles(el.styles)}>`;
    for (const child of el.children) html += renderUIElement(child);
    html += `</div>`;
  } else if (el.type === 'col') {
    el.styles.display = 'flex';
    el.styles.flexDirection = 'column';
    html += `<div${renderStyles(el.styles)}>`;
    for (const child of el.children) html += renderUIElement(child);
    html += `</div>`;
  } else if (el.type === 'icon_button') {
    const width = el.props.width || '52';
    const height = el.props.height || '52';
    // Base classes mimicking Tailwind for demonstration, combined with explicit styles
    const classes = "btn btn-ghost flex items-center justify-center";
    el.styles.width = `${width}px`;
    el.styles.height = `${height}px`;

    // JS Logic attachment!
    const onclick = el.events.onClick ? ` onclick="fetch('${el.events.onClick}', { method: 'POST' })"` : '';

    html += `<button class="${classes}"${renderStyles(el.styles)}${onclick}>`;
    html += `<img src="${el.props.icon}" style="width: ${el.props.size || 21}px;" />`;
    html += `</button>`;
  } else if (el.type === 'text') {
    html += `<p${renderStyles(el.styles)}>${el.textContent || ''}</p>`;
  } else {
    // Default fallback container
    html += `<div class="${el.type}"${renderStyles(el.styles)}>`;
    html += el.textContent || '';
    for (const child of el.children) html += renderUIElement(child);
    html += `</div>`;
  }

  return html;
}

export function generateNodeServer(astNodes: ASTNode[]): string {
  let appNode: AppAST | undefined;
  const routes: RouteAST[] = [];
  const pages: PageAST[] = [];

  for (const node of astNodes) {
    if (node.type === 'app') appNode = node as AppAST;
    if (node.type === 'route') routes.push(node as RouteAST);
    if (node.type === 'page') pages.push(node as PageAST);
  }

  const port = 3000;
  const secureHeaders = appNode?.security?.headers ?? true;
  const escapeXSS = appNode?.security?.xss ?? true;

  let code = `
// GENERATED S⁴ SERVER RUNTIME
import { S4Server } from '@s4/runtime/src/server/index';

const server = new S4Server({
  port: ${port},
  secureHeaders: ${secureHeaders},
  escapeXSS: ${escapeXSS}
});
`;

  for (const route of routes) {
    let handlerBody = '';
    if (route.responseType === 'json') {
      handlerBody = `return Response.json(${JSON.stringify(route.responseData)});`;
    } else if (route.responseType === 'text') {
      handlerBody = `return new Response("${route.responseData}");`;
    }

    code += `
// API Route: ${route.method} ${route.path}
server.register("${route.method}", "${route.path}", (req) => {
  ${handlerBody}
});
`;
  }

  for (const page of pages) {
    // Render the Server-Side HTML
    let bodyHtml = '';
    for (const el of page.elements) {
      bodyHtml += renderUIElement(el);
    }

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${page.name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 0; background: #f9f9f9; }
    .btn { cursor: pointer; border: none; background: transparent; }
  </style>
  <script>
    // S⁴ Auto-Injected State Manager
    window.S4_STATE = ${JSON.stringify(page.state || {})};
    console.log("Loaded S⁴ UI with state:", window.S4_STATE);
  </script>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

    code += `
// Page Route: GET ${page.path}
server.register("GET", "${page.path}", (req) => {
  const html = \`${htmlContent.replace(/`/g, '\\`')}\`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
});
`;
  }

  code += `
server.start();
`;

  return code;
}
