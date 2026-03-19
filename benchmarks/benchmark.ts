async function runBenchmark(url: string, durationInSeconds: number = 5) {
  console.log(`Starting benchmark for ${url} (Duration: ${durationInSeconds}s)...`);

  let totalRequests = 0;
  let errorCount = 0;

  const startTime = Date.now();
  const endTime = startTime + durationInSeconds * 1000;

  // Use a tight asynchronous loop without awaiting fetch directly to simulate concurrency.
  // We'll use a pool of concurrent workers.
  const concurrency = 100;

  const worker = async () => {
    while (Date.now() < endTime) {
      try {
        const res = await fetch(url);
        // Ensure body is consumed
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

  console.log('--- Benchmark Results ---');
  console.log(`URL:              ${url}`);
  console.log(`Total Requests:   ${totalRequests}`);
  console.log(`Errors:           ${errorCount}`);
  console.log(`Duration:         ${actualDuration.toFixed(2)}s`);
  console.log(`Concurrency:      ${concurrency}`);
  console.log(`\x1b[32mReqs/Sec (RPS):   ${rps}\x1b[0m`);
  console.log('-------------------------');
}

async function main() {
  await runBenchmark('http://localhost:3000/');
  await runBenchmark('http://localhost:3000/api/status');
}

main().catch(console.error);
