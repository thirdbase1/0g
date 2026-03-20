import { serve } from 'bun';
import { createFlow, ledger, createWebhookEngine } from '@pulsestack/core';

let walletId: string;
const engine = createWebhookEngine('secret_bench');

engine.register('test.event', async (ctx) => {
  // simple mock
});

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

(async () => {
  const wallet = await ledger.createWallet('user_bench', 'USD');
  walletId = wallet.id;
})();

const server = serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/hello') {
      return new Response(JSON.stringify({ hello: 'world' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/flow') {
      await depositFlow.execute({ walletId, amount: 10 });
      return new Response('OK');
    }

    if (url.pathname === '/webhook') {
      await engine.process({
        payload: { type: 'test.event', data: { id: 1 }, id: '1', created_at: '' },
        headers: { 'x-signature': 'mock_signature' },
        rawBody: JSON.stringify({ type: 'test.event', data: { id: 1 } })
      });
      return new Response('OK');
    }

    return new Response('Not Found', { status: 404 });
  }
});

console.log(`PulseStack Server running at ${server.url}`);
