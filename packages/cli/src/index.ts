#!/usr/bin/env bun
import { devCommand } from "./commands/dev.js";
import { buildCommand } from "./commands/build.js";
import { newCommand } from "./commands/new.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "dev":
      await devCommand(args.slice(1));
      break;
    case "build":
      await buildCommand(args.slice(1));
      break;
    case "new":
      await newCommand(args.slice(1));
      break;
    default:
      console.log(`
S³ Framework CLI

Usage:
  s3 dev [path]
  s3 build --target <vercel|node> [path]
  s3 new <name>
      `);
      process.exit(1);
  }
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
