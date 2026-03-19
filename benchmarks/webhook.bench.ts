import { bench, run } from "mitata";
import { createWebhookEngine } from "@pulsestack/core";

const engine = createWebhookEngine('secret_bench');

engine.register('test.event', async (ctx) => {
  // simple mock
});

const payload = JSON.stringify({ type: 'test.event', data: { id: 1 } });
const headers = { 'x-signature': 'mock_signature' };

bench("Process Webhook Validation", async () => {
  await engine.process({
    payload: JSON.parse(payload),
    headers,
    rawBody: payload
  });
});

await run();
