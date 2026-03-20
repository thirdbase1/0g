import { serve } from 'bun';
import { stripeWebhook } from './webhooks/stripe';
import { processDeposit } from './flows/deposit';
import { ledger } from '@pulsestack/core';

// Initialize ledger for demo
let demoWalletId = '';
(async () => {
  const wallet = await ledger.createWallet('user_123', 'USD');
  demoWalletId = wallet.id;
  console.log('Created demo wallet:', demoWalletId);
})();

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    const frontendRoutes = ['/', '/dashboard', '/login', '/admin'];
    if (frontendRoutes.includes(url.pathname)) {
      const indexFile = Bun.file('index.html');
      return new Response(indexFile, { headers: { 'Content-Type': 'text/html' } });
    }

    // Attempt to serve static files from Vite build or src
    try {
      if (url.pathname.startsWith('/src/') || url.pathname.startsWith('/node_modules/')) {
        const file = Bun.file(`.${url.pathname}`);
        if (await file.exists()) {
          const type = url.pathname.endsWith('.ts') || url.pathname.endsWith('.tsx') ? 'application/javascript' :
                       url.pathname.endsWith('.css') ? 'text/css' : 'text/plain';
          return new Response(file, { headers: { 'Content-Type': type } });
        }
      }
    } catch (e) {
      // ignore
    }

    if (url.pathname === '/api/deposit' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { amount } = body;

        const result = await processDeposit.execute({
          walletId: demoWalletId,
          amount,
          reference: `dep_${Date.now()}`
        });

        return new Response(JSON.stringify({ success: true, transaction: result.transaction }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
      }
    }

    if (url.pathname === '/api/webhooks/stripe' && req.method === 'POST') {
      const rawBody = await req.text();
      const signature = req.headers.get('stripe-signature') || '';

      try {
        const payload = JSON.parse(rawBody);
        await stripeWebhook.process({
          payload,
          headers: { 'x-signature': signature },
          rawBody
        });
        return new Response('OK', { status: 200 });
      } catch (err: any) {
        return new Response(err.message, { status: 400 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
});

console.log('PulseStack Demo running on http://localhost:3000');
