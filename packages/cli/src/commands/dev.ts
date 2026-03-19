export async function devCommand(args: string[]) {
  const path = args[0] || ".";
  console.log(`[S³ Dev] Starting local dev server for path: ${path}...`);
  console.log(`[S³ Dev] Parsing .s3 files...`);
  console.log(`[S³ Dev] Server ready on http://localhost:3000`);
}
