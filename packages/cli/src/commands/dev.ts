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

export async function dev(args: string[]) {
  const targetPath = args[0] || ".";
  console.log(`🚀 Starting S⁴ local dev server for ${targetPath}...`);

  const s4Files = collectFiles(targetPath, '.s4');
  let combinedCode = '';

  for (const file of s4Files) {
    combinedCode += fs.readFileSync(file, 'utf-8') + '\n\n';
  }

  const blocks = parseS4(combinedCode);
  const astNodes = buildAST(blocks);
  const serverCode = generateNodeServer(astNodes);

  const outDir = path.join(process.cwd(), '.s4-out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, 'server.ts');

  // We need to fix the import path for the generated file since it's now in .s4-out
  // and needs to resolve back to packages/runtime/src/server/index
  const fixedServerCode = serverCode.replace(
    "'@s4/runtime/src/server/index'",
    "'../packages/runtime/src/server/index'"
  );

  fs.writeFileSync(outFile, fixedServerCode);

  console.log(`📦 Compiled ${s4Files.length} .s4 files. Spawning server...`);

  const serverProcess = Bun.spawn(['bun', 'run', outFile], {
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  await serverProcess.exited;
}
