# PulseStack Benchmarks

PulseStack runs on Bun to provide blazing fast API routes and performance testing. We benchmark PulseStack around real-product performance, not just "Hello World".

## Benchmark Suite Overview

The `@pulsestack/benchmarks` package is a suite of performance tests utilizing Bun and `mitata` for benchmarking.

1. **Raw JSON Route Benchmark:** Validates low-overhead JSON routing and request handling.
2. **Transaction Flow Benchmark:** Measures performance of complex, multi-step transaction flows with validation, ledger processing, and state updates.
3. **Webhook Verification Benchmark:** Evaluates processing of webhook payloads, including validation and payload handling.

## Running Benchmarks

Inside the `benchmarks` folder:

```bash
cd benchmarks
bun install
bun run bench:route
bun run bench:flow
bun run bench:webhook
bun run bench:all
```
