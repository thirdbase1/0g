# PulseStack Heavy Load Benchmarks

A stress-test of the PulseStack framework's core runtime under heavy, sustained concurrency.

## Environment Specs
- **Bun Version**: 1.2.14
- **CPU**: 4x Intel(R) Xeon(R) Processor @ 2.30GHz
- **Memory**: 8 GB RAM
- **OS**: Linux 6.8.0 x64

## Methodology & Caveats
All tests were run via `autocannon` for 60 seconds targeting a `NODE_ENV=production` Bun server on localhost.

**Important Caveats:**
1. **Memory-only states:** The `/flow` and `/webhook` endpoints use PulseStack's core engines, but operate purely in-memory. In a real application, database I/O, network requests, and external service latency will be the primary bottlenecks, not the framework overhead measured here.
2. **Localhost Networking:** Running the load generator and the server on the same machine tests raw framework + Bun overhead, but competes for CPU resources.
3. **No Auth/Middleware:** These routes do not have authentication guards or deep middleware chains enabled, representing raw execution paths.

---

## Raw JSON Route
*Tests the bare minimum overhead of parsing a URL and returning a static JSON response. Measures framework routing and serialization speed.*

### 5000 Concurrent Connections
`npx autocannon -c 5000 -d 30 http://localhost:3001/hello`

- **Requests/sec:** 48952.89
- **Throughput:** 5.84 MB/s
- **Latency:**
  - **Avg:** 184.08 ms
  - **p50:** 179 ms
  - **p95:** undefined ms
  - **p99:** 209 ms
  - **Max:** 3165 ms
- **Total Requests:** 881268
- **Errors:** 0
- **Timeouts:** 0

### 10000 Concurrent Connections
`npx autocannon -c 10000 -d 30 http://localhost:3001/hello`

- **Requests/sec:** 46065.00
- **Throughput:** 5.49 MB/s
- **Latency:**
  - **Avg:** 438.64 ms
  - **p50:** 388 ms
  - **p95:** undefined ms
  - **p99:** 1793 ms
  - **Max:** 2873 ms
- **Total Requests:** 737206
- **Errors:** 0
- **Timeouts:** 0

## Process Transaction Flow
*Executes a multi-step `Flow` that validates input and updates an in-memory `Ledger` wallet balance. Measures the overhead of the structured flow engine.*

### 5000 Concurrent Connections
`npx autocannon -c 5000 -d 30 http://localhost:3001/flow`

- **Requests/sec:** 50491.74
- **Throughput:** 5.63 MB/s
- **Latency:**
  - **Avg:** 213.82 ms
  - **p50:** 175 ms
  - **p95:** undefined ms
  - **p99:** 460 ms
  - **Max:** 1396 ms
- **Total Requests:** 757466
- **Errors:** 0
- **Timeouts:** 0

### 10000 Concurrent Connections
`npx autocannon -c 10000 -d 30 http://localhost:3001/flow`

- **Requests/sec:** 45153.34
- **Throughput:** 5.04 MB/s
- **Latency:**
  - **Avg:** 388.55 ms
  - **p50:** 362 ms
  - **p95:** undefined ms
  - **p99:** 1722 ms
  - **Max:** 2835 ms
- **Total Requests:** 812935
- **Errors:** 0
- **Timeouts:** 0

## Process Webhook Validation
*Receives a webhook payload, verifies its signature (mocked as true for bench), and routes it to the correct handler. Measures the webhook engine overhead.*

### 5000 Concurrent Connections
`npx autocannon -c 5000 -d 30 http://localhost:3001/webhook`

- **Requests/sec:** 49136.00
- **Throughput:** 5.48 MB/s
- **Latency:**
  - **Avg:** 184.9 ms
  - **p50:** 174 ms
  - **p95:** undefined ms
  - **p99:** 482 ms
  - **Max:** 1222 ms
- **Total Requests:** 835418
- **Errors:** 0
- **Timeouts:** 0

### 10000 Concurrent Connections
`npx autocannon -c 10000 -d 30 http://localhost:3001/webhook`

- **Requests/sec:** 46245.65
- **Throughput:** 5.16 MB/s
- **Latency:**
  - **Avg:** 414.86 ms
  - **p50:** 370 ms
  - **p95:** undefined ms
  - **p99:** 1785 ms
  - **Max:** 2851 ms
- **Total Requests:** 786354
- **Errors:** 0
- **Timeouts:** 0
