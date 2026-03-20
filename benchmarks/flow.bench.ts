import { bench, run } from "mitata";
import { createFlow, ledger } from "@pulsestack/core";

const depositFlow = createFlow<{ walletId: string; amount: number; transaction?: any }>('DepositFlow')
  .addStep({
    name: 'validate',
    run: (ctx) => {
      if (ctx.amount <= 0) throw new Error('Invalid amount');
    }
  })
  .addStep({
    name: 'process',
    run: async (ctx) => {
      ctx.transaction = await ledger.processTransaction(
        ctx.walletId,
        'credit',
        ctx.amount,
        `bench_${Date.now()}`
      );
    }
  });

let walletId: string;

async function setup() {
  const wallet = await ledger.createWallet('user_bench', 'USD');
  walletId = wallet.id;
}

await setup();

bench("Process Transaction Flow", async () => {
  await depositFlow.execute({ walletId, amount: 10 });
});

await run();
