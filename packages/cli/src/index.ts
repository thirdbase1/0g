#!/usr/bin/env bun
import { parseArgs } from "util";
import { generateFlow, generateWebhook, generateLedger } from "./generate";

const args = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    generate: {
      type: "string",
      short: "g"
    },
    name: {
      type: "string",
      short: "n"
    }
  },
  allowPositionals: true
});

const command = args.positionals[0];

switch (command) {
  case 'generate':
  case 'g': {
    const type = args.positionals[1];
    const name = args.values.name || args.positionals[2];

    if (!type || !name) {
      console.error("Usage: pulse generate <type> <name>");
      console.error("Types: flow, webhook, ledger");
      process.exit(1);
    }

    if (type === 'flow') {
      generateFlow(name);
    } else if (type === 'webhook') {
      generateWebhook(name);
    } else if (type === 'ledger') {
      generateLedger(name);
    } else {
      console.error(`Unknown generator type: ${type}`);
      process.exit(1);
    }
    break;
  }
  case 'dev': {
    console.log("Starting PulseStack dev server (Frontend + Backend API)...");
    import("concurrently").then(({ default: concurrently }) => {
      // In a real framework, we'd use process.cwd() exclusively.
      // For this demo/monorepo environment, we'll try to find the nearest app.
      const path = require('path');
      const isMonorepoRoot = process.cwd().endsWith('/app');
      const isCliDir = process.cwd().endsWith('cli');

      let targetPath = process.cwd();
      if (isMonorepoRoot) targetPath = path.resolve(process.cwd(), 'apps/demo');
      if (isCliDir) targetPath = path.resolve(__dirname, '../../../apps/demo');

      concurrently([
        { command: `bun run --cwd ${targetPath} dev`, name: "vite", prefixColor: "blue" },
        { command: `bun run --cwd ${targetPath} start`, name: "api", prefixColor: "green" }
      ]);
    }).catch(err => {
      console.error("Failed to start dev servers. Ensure concurrently is installed.", err);
    });
    break;
  }
  default:
    console.log(`
PulseStack CLI - Fast products, not just fast routes.

Commands:
  dev               Start development server
  generate <type>   Scaffold a new module
    types: flow, webhook, ledger
`);
}
