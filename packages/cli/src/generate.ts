import fs from 'fs';
import path from 'path';

export function generateFlow(name: string) {
  const content = `import { createFlow } from '@pulsestack/core';

export interface ${capitalize(name)}Context {
  userId: string;
  amount: number;
}

export const ${name}Flow = createFlow<${capitalize(name)}Context>('${name}')
  .addStep({
    name: 'validate',
    run: async (ctx) => {
      if (ctx.amount <= 0) throw new Error('Invalid amount');
    }
  })
  .addStep({
    name: 'process',
    run: async (ctx) => {
      console.log(\`Processing \${ctx.amount} for user \${ctx.userId}\`);
    }
  });
`;

  writeFile(path.join(process.cwd(), `src/flows/${name}.ts`), content);
}

export function generateWebhook(name: string) {
  const content = `import { createWebhookEngine } from '@pulsestack/core';

export const ${name}Webhook = createWebhookEngine(process.env.WEBHOOK_SECRET || 'secret');

${name}Webhook.register('charge.succeeded', async (ctx) => {
  console.log('Charge succeeded:', ctx.payload);
});
`;
  writeFile(path.join(process.cwd(), `src/webhooks/${name}.ts`), content);
}

export function generateLedger(name: string) {
  const content = `import { ledger } from '@pulsestack/core';

// Example usage of ledger module
export async function createAccount() {
  const wallet = await ledger.createWallet('user123', 'USD');
  return wallet;
}

export async function processPayment(walletId: string, amount: number) {
  return await ledger.processTransaction(walletId, 'credit', amount, 'payment_123');
}
`;
  writeFile(path.join(process.cwd(), `src/ledger/${name}.ts`), content);
}

function writeFile(filepath: string, content: string) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, content);
  console.log(`✓ Generated ${filepath}`);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
