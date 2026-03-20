# PulseStack Architecture

PulseStack uses a Bun workspace with a monorepo setup:

- `packages/core`: The foundation containing the Flow engine, Webhook engine, Event system, Ledger (Transactions), Auth module, and Adapter system (Telegram, Email, etc.).
- `packages/cli`: A tool for scaffolding modules (flows, webhooks, ledgers) and running the development server.
- `packages/ui`: A set of React/Tailwind UI components tailored for premium product dashboards, tables, wallets, and settings.
- `packages/create-pulsestack`: (WIP) The starter generator to initialize a PulseStack project with the product-first shell.
- `apps/demo`: A realistic starter template showcasing a VTU/Wallet application built with PulseStack.
- `benchmarks`: Performance testing suite for raw routes, auth, webhooks, and transactions.
- `docs`: Extensive documentation covering every piece of the framework.

## Folder Structure

```
.
├── apps
│   └── demo           # Example App / Starter Template
├── packages
│   ├── cli            # Command Line Interface (pulse)
│   ├── core           # Framework Foundation (flows, webhooks, ledger, events, auth)
│   ├── create-pulsestack # Project Generator
│   └── ui             # React UI Components
├── benchmarks         # Benchmark Suite
└── docs               # Framework Documentation
```

## Core Modules

1. **Flow Engine**: A structured way to define business logic and transactions (e.g. `validate -> process -> notify`).
2. **Webhook Engine**: Utilities to handle, verify, and retry webhooks (e.g. Stripe, Telegram).
3. **Event System**: Event emitter/subscriber with background job abstractions.
4. **Ledger/Transaction Module**: Safe money-flow abstractions (wallets, double-entry ledger basics).
5. **Auth Module**: Session/token utilities and role management.
6. **Adapter System**: Pluggable architecture for external services (Telegram, Email, SMS).
