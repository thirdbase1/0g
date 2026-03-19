# PulseStack CLI

The `@pulsestack/cli` provides a robust set of tools to scaffold and manage PulseStack applications.

## Installation

When inside a PulseStack project:

```bash
bun install @pulsestack/cli
```

Or just use the local bin script for the monorepo:

```bash
bun run --cwd packages/cli pulse [command]
```

## Commands

- `pulse generate <type> <name>`
  - Scaffolds a new module in your application.
  - Options for `<type>`: `flow`, `webhook`, `ledger`
  - Examples:
    ```bash
    pulse generate flow deposit
    pulse generate webhook stripe
    pulse generate ledger createWallet
    ```

- `pulse dev`
  - Starts the development server with hot-reloading for PulseStack products.
