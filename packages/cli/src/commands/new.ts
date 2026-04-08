export function newApp(args: string[]) {
  const name = args[0];
  if (!name) {
    console.error("Missing name argument: s4 new <app-name>");
    process.exit(1);
  }
  console.log(`✨ Creating new S⁴ starter app in ./${name}...`);
  // Will pull from templates/minimal or starter templates
}
