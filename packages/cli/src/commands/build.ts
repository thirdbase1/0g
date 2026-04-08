import { parseArgs } from "util";
import * as fs from 'fs';
import * as path from 'path';
import { parseS4 } from '../../../compiler/src/parser/index';
import { buildAST } from '../../../compiler/src/ast/index';
import { generateNodeServer } from '../../../compiler/src/generators/node/index';

function collectFiles(dir: string, extension: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(collectFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  }
  return results;
}

export function build(args: string[]) {
  const { values, positionals } = parseArgs({
    args,
    options: {
      target: {
        type: "string",
      },
    },
    allowPositionals: true,
  });

  const target = values.target || "vercel";
  const targetPath = positionals[0] || ".";

  console.log(`📦 Building S⁴ app for target: ${target} in ${targetPath}`);

  const s4Files = collectFiles(targetPath, '.s4');
  let combinedCode = '';
  for (const file of s4Files) {
    combinedCode += fs.readFileSync(file, 'utf-8') + '\n\n';
  }

  const blocks = parseS4(combinedCode);
  const astNodes = buildAST(blocks);

  if (target === "vercel") {
    console.log("Generating Vercel-compatible build artifacts...");

    // Simulate vercel output generation
    const outDir = path.join(process.cwd(), '.vercel', 'output', 'functions');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Simple Vercel generator mock wrapper around our Node logic
    const serverCode = generateNodeServer(astNodes).replace(
       "'@s4/runtime/src/server/index'",
       "'../../../packages/runtime/src/server/index'"
    );

    fs.writeFileSync(path.join(outDir, 'index.func.js'), serverCode);
    console.log(`✅ Emitted Vercel Output API artifact to .vercel/output/functions`);

  } else if (target === "node") {
    console.log("Generating standard Node/Bun build output...");

    const outDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const serverCode = generateNodeServer(astNodes).replace(
       "'@s4/runtime/src/server/index'",
       "'../packages/runtime/src/server/index'"
    );

    fs.writeFileSync(path.join(outDir, 'server.js'), serverCode);
    console.log(`✅ Emitted Node/Bun artifact to dist/server.js`);

  } else {
    console.error("Unknown target. Use 'vercel' or 'node'.");
  }
}
