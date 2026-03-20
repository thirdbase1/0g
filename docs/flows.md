# PulseStack Flows

PulseStack treats business logic as flows. A flow is a sequence of steps that process data, handle transactions, emit events, and log activity in a structured and type-safe way.

## Sample Flow: Process Deposit

```typescript
import { createFlow, ledger } from '@pulsestack/core';

export interface DepositContext {
  walletId: string;
  amount: number;
  reference: string;
  transaction?: any;
}

export const processDeposit = createFlow<DepositContext>('ProcessDeposit')
  .addStep({
    name: 'validate',
    run: async (ctx) => {
      if (!ctx.walletId) throw new Error('Wallet ID is required');
      if (ctx.amount <= 0) throw new Error('Amount must be positive');
    }
  })
  .addStep({
    name: 'process_ledger',
    run: async (ctx) => {
      ctx.transaction = await ledger.processTransaction(
        ctx.walletId,
        'credit',
        ctx.amount,
        ctx.reference,
        { source: 'stripe' }
      );
      console.log(`Deposited \${ctx.amount} to \${ctx.walletId}`);
    },
    rollback: async (ctx, err) => {
      // Logic to reverse ledger transaction on failure
      console.error(`Rolling back deposit for \${ctx.walletId}`);
    }
  })
  .addStep({
    name: 'notify',
    run: async (ctx) => {
      // send email or telegram
      console.log(`Sent notification for deposit \${ctx.transaction.id}`);
    }
  });

```

## Using the Flow

```typescript
try {
  const result = await processDeposit.execute({
    walletId: 'user_123',
    amount: 100,
    reference: 'dep_123'
  });
  console.log('Success!', result.transaction);
} catch (error) {
  console.error('Failed to process deposit:', error);
}
```
