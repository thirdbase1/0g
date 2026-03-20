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
      console.log(`Deposited ${ctx.amount} to ${ctx.walletId}`);
    },
    rollback: async (ctx, err) => {
      // Logic to reverse ledger transaction on failure
      console.error(`Rolling back deposit for ${ctx.walletId}`);
    }
  })
  .addStep({
    name: 'notify',
    run: async (ctx) => {
      // e.g. send email or telegram
      console.log(`Sent notification for deposit ${ctx.transaction.id}`);
    }
  });
