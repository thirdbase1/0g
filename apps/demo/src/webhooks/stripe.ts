import { createWebhookEngine } from '@pulsestack/core';

export const stripeWebhook = createWebhookEngine(process.env.STRIPE_SECRET || 'whsec_demo');

stripeWebhook.register('charge.succeeded', async (ctx) => {
  const { data } = ctx.payload;
  console.log(`Charge succeeded for amount: ${data.amount}`);
  // In a real app, call a flow here to process the deposit
  // e.g. await processDeposit.execute({ walletId: data.metadata.walletId, amount: data.amount });
});

stripeWebhook.register('charge.failed', async (ctx) => {
  const { data } = ctx.payload;
  console.error(`Charge failed: ${data.failure_message}`);
});
