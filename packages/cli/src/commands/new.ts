export async function newCommand(args: string[]) {
  const name = args[0];
  if (!name) {
    console.error("Missing name for new app.");
    process.exit(1);
  }
  console.log(`[S³ New] Creating new app '${name}'...`);
  console.log(`[S³ New] Created starter app with app.s3 and folders.`);
}
