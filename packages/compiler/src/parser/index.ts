export interface Block {
  indent: number;
  keyword: string;
  args: string[];
  children: Block[];
}

export function parseS4(code: string): Block[] {
  const lines = code.split('\n');
  const blocks: Block[] = [];
  const stack: Block[] = [];

  for (const rawLine of lines) {
    // Ignore empty lines and pure comments (we don't have comments in spec yet but just in case)
    if (rawLine.trim() === '') continue;

    const match = rawLine.match(/^(\s*)(.*)$/);
    if (!match) continue;

    const indent = match[1].length;
    const content = match[2];

    const tokens = content.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    if (tokens.length === 0) continue;

    const keyword = tokens[0];
    const args = tokens.slice(1).map(arg =>
      arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg
    );

    const block: Block = {
      indent,
      keyword,
      args,
      children: []
    };

    // If it's a root level block
    if (indent === 0) {
      blocks.push(block);
      stack.length = 0; // clear stack
      stack.push(block);
    } else {
      // Find the parent block. It must have an indentation strictly less than the current block.
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(block);
        stack.push(block);
      } else {
        // Fallback if indentation is weird, treat as root
        blocks.push(block);
        stack.push(block);
      }
    }
  }

  return blocks;
}
