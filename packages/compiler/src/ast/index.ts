import { Block } from '../parser/index.js';

export interface ASTNode {
  type: 'app' | 'route' | 'page' | 'entity' | 'flow' | 'component';
  name: string;
}

export interface AppAST extends ASTNode {
  type: 'app';
  runtime: string;
  adapter: string;
  security: {
    headers: boolean;
    xss: boolean;
  };
}

export interface RouteAST extends ASTNode {
  type: 'route';
  method: string;
  path: string;
  responseType: 'json' | 'text' | 'html';
  responseData: any;
}

export interface UIElement {
  type: string;
  props: Record<string, string | number | boolean>;
  styles: Record<string, string | number>;
  events: Record<string, string>;
  children: UIElement[];
  textContent?: string;
}

export interface PageAST extends ASTNode {
  type: 'page';
  path: string;
  layout: string;
  state: Record<string, any>;
  elements: UIElement[];
}

// Function to recursively parse a block into a UI element
function parseUIElement(block: Block): UIElement {
  const element: UIElement = {
    type: block.keyword,
    props: {},
    styles: {},
    events: {},
    children: []
  };

  // Basic property parsing for standard elements
  if (element.type === 'icon_button') {
     element.props.icon = block.args[1];
     for (let i = 2; i < block.args.length; i += 2) {
       element.props[block.args[i]] = block.args[i+1];
     }
  } else if (element.type === 'row' || element.type === 'col') {
     for (let i = 0; i < block.args.length; i++) {
        if (block.args[i] === 'align') element.styles.alignItems = block.args[++i];
        if (block.args[i] === 'justify') element.styles.justifyContent = block.args[++i];
        if (block.args[i] === 'gap') element.styles.gap = block.args[++i] + 'px';
        if (block.args[i] === 'fill') element.styles.width = '100%';
     }
  } else if (element.type === 'text' || element.type === 'button') {
     element.textContent = block.args.join(' ');
  } else {
     // Generic component or unknown
     element.textContent = block.args.join(' ');
  }

  // Parse styling and behavior children
  for (const child of block.children) {
    if (child.keyword === 'position') {
       element.styles.position = child.args[0];
       for (let i = 1; i < child.args.length; i += 2) {
          element.styles[child.args[i]] = child.args[i+1] + 'px';
       }
    } else if (child.keyword === 'drop_shadow') {
       element.styles.boxShadow = child.args.join(' ');
    } else if (child.keyword === 'backdrop') {
       if (child.args[0] === 'blur') element.styles.backdropFilter = `blur(${child.args[1]}px)`;
    } else if (child.keyword === 'on_click') {
       element.events.onClick = child.args.join(' ');
    } else {
       // Nested UI element
       element.children.push(parseUIElement(child));
    }
  }

  return element;
}

export function buildAST(blocks: Block[]): ASTNode[] {
  const ast: ASTNode[] = [];

  for (const block of blocks) {
    if (block.keyword === 'app') {
      const appAst: AppAST = {
        type: 'app',
        name: block.args[0] || 'App',
        runtime: 'bun',
        adapter: 'node',
        security: { headers: true, xss: true }
      };

      for (const child of block.children) {
        if (child.keyword === 'runtime') appAst.runtime = child.args[0];
        if (child.keyword === 'adapter') appAst.adapter = child.args[0];
        if (child.keyword === 'security') {
          for (const secChild of child.children) {
            if (secChild.keyword === 'headers') appAst.security.headers = secChild.args[0] === 'secure';
            if (secChild.keyword === 'xss') appAst.security.xss = secChild.args[0] === 'escape';
          }
        }
      }
      ast.push(appAst);
    }

    if (block.keyword === 'route') {
      const routeAst: RouteAST = {
        type: 'route',
        method: block.args[0]?.toUpperCase() || 'GET',
        path: block.args[1] || '/',
        name: `${block.args[0]}_${block.args[1]}`,
        responseType: 'text',
        responseData: ''
      };

      for (const child of block.children) {
        if (child.keyword === 'json') {
           routeAst.responseType = 'json';
           const data: any = {};
           for (const kv of child.children) {
              data[kv.keyword] = kv.args[0] || kv.args.join(' ');
           }
           routeAst.responseData = data;
        }
        if (child.keyword === 'text') {
           routeAst.responseType = 'text';
           routeAst.responseData = child.args.join(' ');
        }
      }
      ast.push(routeAst);
    }

    if (block.keyword === 'page') {
      const pageAst: PageAST = {
        type: 'page',
        path: block.args[0] || '/',
        name: block.args[0],
        layout: 'default',
        state: {},
        elements: []
      };

      for (const child of block.children) {
        if (child.keyword === 'layout') pageAst.layout = child.args[0];
        else if (child.keyword === 'state') {
           for (let i = 0; i < child.args.length; i += 2) {
              const key = child.args[i];
              let val: any = child.args[i+1];
              if (val === 'true') val = true;
              else if (val === 'false') val = false;
              else if (!isNaN(Number(val))) val = Number(val);
              pageAst.state[key] = val;
           }
        }
        else {
           // Any other root block in a page is considered a UI element
           pageAst.elements.push(parseUIElement(child));
        }
      }
      ast.push(pageAst);
    }
  }

  return ast;
}
