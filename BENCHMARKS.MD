# S⁴ Framework UI & API Benchmarks

To verify the raw execution speed of the S⁴ declarative SSR Compiler, we ran a direct native load test.

## Environment
- **Runtime:** Bun Native `Bun.serve()`
- **Concurrency:** 100 workers
- **Duration:** 5 seconds

## Results

1. URL: http://localhost:3000/api/hello | Total Requests: 157191 | RPS: **31413.07** (API Route)
2. URL: http://localhost:3000/ui | Total Requests: 209783 | RPS: **41931.44** (SSR UI Route)

*S⁴ UI and APIs render synchronously with zero VDOM overhead, compiling directly down to string manipulation within the native JS engine!*
