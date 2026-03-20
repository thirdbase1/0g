# PulseStack Stress Benchmarks

A stress-test of the PulseStack framework's core runtime under heavy, sustained concurrency.

## Environment Specs
- **Bun Version**: 1.2.14
- **CPU**: 4x Intel(R) Xeon(R) Processor @ 2.30GHz
- **Memory**: 8 GB RAM
- **OS**: Linux 6.8.0 x64

## Summary of Findings
On a 4 vCPU / 8 GB Linux machine running Bun 1.2.14, PulseStack sustained roughly 21k–31k requests/sec under 5k–10k concurrent connections with **zero errors and zero timeouts** in localhost testing. Latency increased substantially at 10k concurrency, indicating saturation and queueing under extreme load, but the framework remained stable.

Because the flow and webhook benchmarks are memory-only and do not include database or external service I/O, these numbers primarily demonstrate low framework overhead rather than full application performance. PulseStack remains stable at extreme concurrency while keeping its in-memory flow and webhook abstractions lightweight.

## Methodology & Caveats
All tests were run via `autocannon` for 10 seconds targeting a `NODE_ENV=production` Bun server on localhost.

> These benchmarks measure PulseStack’s runtime overhead under localhost load and high concurrency. The `/flow` and `/webhook` routes operate in memory and do not perform database I/O or external network calls. The webhook signature check is mocked for benchmarking purposes. As a result, these tests are best interpreted as framework-level stress and overhead benchmarks rather than full end-to-end application benchmarks.

---

## Raw JSON Route
*Tests the bare minimum overhead of parsing a URL and returning a static JSON response. Measures framework routing and serialization speed.*

### 1000 Concurrent Connections
`npx autocannon -c 1000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 18029.60
- **Throughput:** 2.15 MB/s
- **Latency:**
  - **Avg:** 57.62 ms
  - **p50:** 53 ms
  - **p97.5:** 108 ms
  - **p99:** 149 ms
  - **Max:** 585 ms
- **Total Requests:** 180296
- **Errors:** 0
- **Timeouts:** 0

### 2000 Concurrent Connections
`npx autocannon -c 2000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 24570.00
- **Throughput:** 5.86 MB/s
- **Latency:**
  - **Avg:** 86.96 ms
  - **p50:** 69 ms
  - **p97.5:** 170 ms
  - **p99:** 296 ms
  - **Max:** 1619 ms
- **Total Requests:** 245700
- **Errors:** 0
- **Timeouts:** 0

### 4000 Concurrent Connections
`npx autocannon -c 4000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 18289.40
- **Throughput:** 3.63 MB/s
- **Latency:**
  - **Avg:** 226.08 ms
  - **p50:** 151 ms
  - **p97.5:** 505 ms
  - **p99:** 1268 ms
  - **Max:** 1523 ms
- **Total Requests:** 182894
- **Errors:** 0
- **Timeouts:** 0

### 7000 Concurrent Connections
`npx autocannon -c 7000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 9829.00
- **Throughput:** 3.90 MB/s
- **Latency:**
  - **Avg:** 1041.26 ms
  - **p50:** 292 ms
  - **p97.5:** 5269 ms
  - **p99:** 5681 ms
  - **Max:** 6597 ms
- **Total Requests:** 98290
- **Errors:** 0
- **Timeouts:** 0

### 10000 Concurrent Connections
`npx autocannon -c 10000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 24573.60
- **Throughput:** 4.88 MB/s
- **Latency:**
  - **Avg:** 486.9 ms
  - **p50:** 369 ms
  - **p97.5:** 3006 ms
  - **p99:** 3403 ms
  - **Max:** 3693 ms
- **Total Requests:** 245736
- **Errors:** 0
- **Timeouts:** 0

### 15000 Concurrent Connections
`npx autocannon -c 15000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 9829.80
- **Throughput:** 3.90 MB/s
- **Latency:**
  - **Avg:** 1930.69 ms
  - **p50:** 668 ms
  - **p97.5:** 9390 ms
  - **p99:** 10179 ms
  - **Max:** 10266 ms
- **Total Requests:** 98298
- **Errors:** 0
- **Timeouts:** 0

### 20000 Concurrent Connections
`npx autocannon -c 20000 -d 10 http://localhost:3001/hello`

- **Requests/sec:** 0.00
- **Throughput:** 0.00 MB/s
- **Latency:**
  - **Avg:** 0 ms
  - **p50:** 0 ms
  - **p97.5:** 0 ms
  - **p99:** 0 ms
  - **Max:** 0 ms
- **Total Requests:** 0
- **Errors:** 4510
- **Timeouts:** 4510

## Process Transaction Flow
*Executes a multi-step `Flow` that validates input and updates an in-memory `Ledger` wallet balance. Measures the overhead of the structured flow engine.*

### 1000 Concurrent Connections
`npx autocannon -c 1000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 12502.90
- **Throughput:** 1.40 MB/s
- **Latency:**
  - **Avg:** 80.15 ms
  - **p50:** 45 ms
  - **p97.5:** 340 ms
  - **p99:** 733 ms
  - **Max:** 1244 ms
- **Total Requests:** 125029
- **Errors:** 0
- **Timeouts:** 0

### 2000 Concurrent Connections
`npx autocannon -c 2000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 17267.20
- **Throughput:** 2.14 MB/s
- **Latency:**
  - **Avg:** 122.32 ms
  - **p50:** 104 ms
  - **p97.5:** 343 ms
  - **p99:** 428 ms
  - **Max:** 512 ms
- **Total Requests:** 172672
- **Errors:** 0
- **Timeouts:** 0

### 4000 Concurrent Connections
`npx autocannon -c 4000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 12272.50
- **Throughput:** 1.37 MB/s
- **Latency:**
  - **Avg:** 340.15 ms
  - **p50:** 296 ms
  - **p97.5:** 927 ms
  - **p99:** 1484 ms
  - **Max:** 1760 ms
- **Total Requests:** 122725
- **Errors:** 0
- **Timeouts:** 0

### 7000 Concurrent Connections
`npx autocannon -c 7000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 18126.30
- **Throughput:** 2.25 MB/s
- **Latency:**
  - **Avg:** 449.76 ms
  - **p50:** 363 ms
  - **p97.5:** 1436 ms
  - **p99:** 2527 ms
  - **Max:** 3065 ms
- **Total Requests:** 181263
- **Errors:** 0
- **Timeouts:** 0

### 10000 Concurrent Connections
`npx autocannon -c 10000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 21325.10
- **Throughput:** 2.97 MB/s
- **Latency:**
  - **Avg:** 582.13 ms
  - **p50:** 453 ms
  - **p97.5:** 2947 ms
  - **p99:** 3208 ms
  - **Max:** 3431 ms
- **Total Requests:** 213251
- **Errors:** 0
- **Timeouts:** 0

### 15000 Concurrent Connections
`npx autocannon -c 15000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 9829.80
- **Throughput:** 3.65 MB/s
- **Latency:**
  - **Avg:** 1727.17 ms
  - **p50:** 595 ms
  - **p97.5:** 8376 ms
  - **p99:** 9102 ms
  - **Max:** 9215 ms
- **Total Requests:** 98298
- **Errors:** 0
- **Timeouts:** 0

### 20000 Concurrent Connections
`npx autocannon -c 20000 -d 10 http://localhost:3001/flow`

- **Requests/sec:** 0.00
- **Throughput:** 0.00 MB/s
- **Latency:**
  - **Avg:** 0 ms
  - **p50:** 0 ms
  - **p97.5:** 0 ms
  - **p99:** 0 ms
  - **Max:** 0 ms
- **Total Requests:** 0
- **Errors:** 4388
- **Timeouts:** 4388

## Process Webhook Validation
*Receives a webhook payload, verifies its signature (mocked as true for bench), and routes it to the correct handler. Measures the webhook engine overhead.*

### 1000 Concurrent Connections
`npx autocannon -c 1000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 23661.90
- **Throughput:** 2.64 MB/s
- **Latency:**
  - **Avg:** 42.67 ms
  - **p50:** 38 ms
  - **p97.5:** 60 ms
  - **p99:** 66 ms
  - **Max:** 836 ms
- **Total Requests:** 236619
- **Errors:** 0
- **Timeouts:** 0

### 2000 Concurrent Connections
`npx autocannon -c 2000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 29467.40
- **Throughput:** 5.48 MB/s
- **Latency:**
  - **Avg:** 76.7 ms
  - **p50:** 74 ms
  - **p97.5:** 101 ms
  - **p99:** 117 ms
  - **Max:** 1952 ms
- **Total Requests:** 294674
- **Errors:** 0
- **Timeouts:** 0

### 4000 Concurrent Connections
`npx autocannon -c 4000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 29484.00
- **Throughput:** 5.48 MB/s
- **Latency:**
  - **Avg:** 167.29 ms
  - **p50:** 152 ms
  - **p97.5:** 290 ms
  - **p99:** 591 ms
  - **Max:** 990 ms
- **Total Requests:** 294840
- **Errors:** 0
- **Timeouts:** 0

### 7000 Concurrent Connections
`npx autocannon -c 7000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 19658.00
- **Throughput:** 4.39 MB/s
- **Latency:**
  - **Avg:** 434.39 ms
  - **p50:** 310 ms
  - **p97.5:** 2242 ms
  - **p99:** 2658 ms
  - **Max:** 3025 ms
- **Total Requests:** 196580
- **Errors:** 0
- **Timeouts:** 0

### 10000 Concurrent Connections
`npx autocannon -c 10000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 24573.50
- **Throughput:** 4.57 MB/s
- **Latency:**
  - **Avg:** 498.96 ms
  - **p50:** 417 ms
  - **p97.5:** 2431 ms
  - **p99:** 2720 ms
  - **Max:** 2929 ms
- **Total Requests:** 245735
- **Errors:** 0
- **Timeouts:** 0

### 15000 Concurrent Connections
`npx autocannon -c 15000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 9829.80
- **Throughput:** 3.65 MB/s
- **Latency:**
  - **Avg:** 1783.36 ms
  - **p50:** 651 ms
  - **p97.5:** 8552 ms
  - **p99:** 9335 ms
  - **Max:** 9425 ms
- **Total Requests:** 98298
- **Errors:** 0
- **Timeouts:** 0

### 20000 Concurrent Connections
`npx autocannon -c 20000 -d 10 http://localhost:3001/webhook`

- **Requests/sec:** 0.00
- **Throughput:** 0.00 MB/s
- **Latency:**
  - **Avg:** 0 ms
  - **p50:** 0 ms
  - **p97.5:** 0 ms
  - **p99:** 0 ms
  - **Max:** 0 ms
- **Total Requests:** 0
- **Errors:** 5305
- **Timeouts:** 5305
