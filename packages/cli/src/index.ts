import { parseArgs } from "util";
import { dev } from "./commands/dev";
import { build } from "./commands/build";
import { newApp } from "./commands/new";

const args = process.argv.slice(2);
const command = args[0];

if (command === "dev") {
  dev(args.slice(1));
} else if (command === "build") {
  build(args.slice(1));
} else if (command === "new") {
  newApp(args.slice(1));
} else {
  console.log("S⁴ CLI");
  console.log("Usage: s4 dev | s4 build --target <vercel|node> | s4 new <name>");
}
