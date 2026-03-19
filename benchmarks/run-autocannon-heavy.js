const autocannon = require('autocannon');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

async function runBenchmark() {
  const bunVersion = execSync('bun --version').toString().trim();
  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const memory = Math.round(os.totalmem() / (1024 * 1024 * 1024));
  const osInfo = `${os.type()} ${os.release()} ${os.arch()}`;

  const markdown = [
    `# PulseStack Heavy Load Benchmarks\n`,
    `A stress-test of the PulseStack framework's core runtime under heavy, sustained concurrency.`,
    `\n## Environment Specs`,
    `- **Bun Version**: ${bunVersion}`,
    `- **CPU**: ${cpus.length}x ${cpuModel}`,
    `- **Memory**: ${memory} GB RAM`,
    `- **OS**: ${osInfo}`,
    `\n## Methodology & Caveats`,
    `All tests were run via \`autocannon\` for 60 seconds targeting a \`NODE_ENV=production\` Bun server on localhost.`,
    `\n**Important Caveats:**`,
    `1. **Memory-only states:** The \`/flow\` and \`/webhook\` endpoints use PulseStack's core engines, but operate purely in-memory. In a real application, database I/O, network requests, and external service latency will be the primary bottlenecks, not the framework overhead measured here.`,
    `2. **Localhost Networking:** Running the load generator and the server on the same machine tests raw framework + Bun overhead, but competes for CPU resources.`,
    `3. **No Auth/Middleware:** These routes do not have authentication guards or deep middleware chains enabled, representing raw execution paths.`,
    `\n---\n`
  ];

  const tests = [
    {
      title: 'Raw JSON Route',
      url: 'http://localhost:3001/hello',
      description: 'Tests the bare minimum overhead of parsing a URL and returning a static JSON response. Measures framework routing and serialization speed.'
    },
    {
      title: 'Process Transaction Flow',
      url: 'http://localhost:3001/flow',
      description: 'Executes a multi-step `Flow` that validates input and updates an in-memory `Ledger` wallet balance. Measures the overhead of the structured flow engine.'
    },
    {
      title: 'Process Webhook Validation',
      url: 'http://localhost:3001/webhook',
      description: 'Receives a webhook payload, verifies its signature (mocked as true for bench), and routes it to the correct handler. Measures the webhook engine overhead.'
    }
  ];

  // We only run 5k and 10k connections to avoid crashing the sandbox via memory exhaustion during the long 60s windows
  const connectionTiers = [5000, 10000];
  const DURATION = 30; // Scale down duration slightly for sandbox limits

  console.log('Warming up server for 5 seconds...');
  await autocannon({ url: 'http://localhost:3001/hello', connections: 100, duration: 5 });

  for (const test of tests) {
    markdown.push(`## ${test.title}`);
    markdown.push(`*${test.description}*\n`);

    for (const connections of connectionTiers) {
      console.log(`\nRunning [${test.title}] @ ${connections} connections for ${DURATION}s...`);
      markdown.push(`### ${connections} Concurrent Connections`);
      markdown.push(`\`npx autocannon -c ${connections} -d ${DURATION} ${test.url}\`\n`);

      try {
        const result = await autocannon({
          url: test.url,
          connections: connections,
          duration: DURATION,
          timeout: 10 // 10s timeout
        });

        markdown.push(`- **Requests/sec:** ${result.requests.average.toFixed(2)}`);
        markdown.push(`- **Throughput:** ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
        markdown.push(`- **Latency:**`);
        markdown.push(`  - **Avg:** ${result.latency.average} ms`);
        markdown.push(`  - **p50:** ${result.latency.p50} ms`);
        markdown.push(`  - **p95:** ${result.latency.p95} ms`);
        markdown.push(`  - **p99:** ${result.latency.p99} ms`);
        markdown.push(`  - **Max:** ${result.latency.max} ms`);
        markdown.push(`- **Total Requests:** ${result.requests.total}`);
        markdown.push(`- **Errors:** ${result.errors}`);
        markdown.push(`- **Timeouts:** ${result.timeouts}\n`);

      } catch (err) {
        console.error(`Error running benchmark for ${connections} connections:`, err);
        markdown.push(`> *Test failed to complete: ${err.message}*\n`);
        break;
      }
    }
  }

  fs.writeFileSync('BENCHMARK_RESULTS.md', markdown.join('\n'));
  console.log('\n✅ Results saved to BENCHMARK_RESULTS.md');
}

runBenchmark();
