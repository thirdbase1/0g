async function runBenchmark(url: string, durationInSeconds: number = 5) {
  console.log(`Starting benchmark for ${url} (Duration: ${durationInSeconds}s)...`);

  let totalRequests = 0;
  let errorCount = 0;

  const startTime = Date.now();
  const endTime = startTime + durationInSeconds * 1000;

  const concurrency = 100;

  const worker = async () => {
    while (Date.now() < endTime) {
      try {
        const res = await fetch(url);
        await res.text();
        if (res.ok) {
          totalRequests++;
        } else {
          errorCount++;
        }
      } catch (e) {
        errorCount++;
      }
    }
  };

  const promises = [];
  for (let i = 0; i < concurrency; i++) {
    promises.push(worker());
  }

  await Promise.all(promises);

  const actualDuration = (Date.now() - startTime) / 1000;
  const rps = (totalRequests / actualDuration).toFixed(2);

  return `URL: ${url} | Total Requests: ${totalRequests} | RPS: **${rps}**`;
}

async function main() {
  const r1 = await runBenchmark('http://localhost:3000/api/hello');
  const r2 = await runBenchmark('http://localhost:3000/ui');

  const md = `# S⁴ Framework UI & API Benchmarks

To verify the raw execution speed of the S⁴ declarative SSR Compiler, we ran a direct native load test.

## Environment
- **Runtime:** Bun Native \`Bun.serve()\`
- **Concurrency:** 100 workers
- **Duration:** 5 seconds

## Results

1. ${r1} (API Route)
2. ${r2} (SSR UI Route)

*S⁴ UI and APIs render synchronously with zero VDOM overhead, compiling directly down to string manipulation within the native JS engine!*
`;

  Bun.write("BENCHMARKS.MD", md);
}

main().catch(console.error);
