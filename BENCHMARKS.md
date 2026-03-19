# S⁴ Framework Benchmarks

We emphasize **Speed**, and to prove it, we ran a native load test hitting our framework directly, mimicking realistic concurrent fetch operations.

## Test Environment
- **Runtime:** Bun 1.x
- **Concurrency:** 100 simultaneous workers
- **Duration:** 5 seconds per test

## Results

```text
Starting benchmark for http://localhost:3000/ (Duration: 5s)...
--- Benchmark Results ---
URL:              http://localhost:3000/
Total Requests:   142464
Errors:           0
Duration:         5.00s
Concurrency:      100
[32mReqs/Sec (RPS):   28475.71[0m
-------------------------
Starting benchmark for http://localhost:3000/api/status (Duration: 5s)...
--- Benchmark Results ---
URL:              http://localhost:3000/api/status
Total Requests:   180713
Errors:           0
Duration:         5.00s
Concurrency:      100
[32mReqs/Sec (RPS):   36128.15[0m
-------------------------
```
