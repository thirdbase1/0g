const autocannon = require('autocannon');
const fs = require('fs');

async function runBenchmark() {
  const markdown = ['# PulseStack Benchmarks\n\nResults for 5,000 concurrent connections over 10 seconds.\n'];

  const tests = [
    { title: 'Raw JSON Route', url: 'http://localhost:3001/hello' },
    { title: 'Process Transaction Flow', url: 'http://localhost:3001/flow' },
    { title: 'Process Webhook Validation', url: 'http://localhost:3001/webhook' }
  ];

  for (const test of tests) {
    console.log(`Running benchmark for: ${test.title}...`);
    const result = await autocannon({
      url: test.url,
      connections: 5000,
      duration: 10
    });

    markdown.push(`## ${test.title}\n`);
    markdown.push(`- **Requests/sec:** ${result.requests.average.toFixed(2)}`);
    markdown.push(`- **Latency (Avg):** ${result.latency.average} ms`);
    markdown.push(`- **Latency (p99):** ${result.latency.p99} ms`);
    markdown.push(`- **Total Requests:** ${result.requests.total}`);
    markdown.push(`- **Errors:** ${result.errors}\n`);
  }

  fs.writeFileSync('BENCHMARK_RESULTS.md', markdown.join('\n'));
  console.log('Results saved to BENCHMARK_RESULTS.md');
}

runBenchmark();
