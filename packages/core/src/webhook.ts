export interface WebhookPayload {
  id: string;
  type: string;
  data: any;
  created_at: string;
}

export interface WebhookHandlerContext {
  payload: WebhookPayload;
  headers: Record<string, string>;
  rawBody: string;
}

export type WebhookHandlerFn = (ctx: WebhookHandlerContext) => Promise<void> | void;

export class WebhookEngine {
  private handlers: Map<string, WebhookHandlerFn> = new Map();
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  register(eventType: string, handler: WebhookHandlerFn) {
    this.handlers.set(eventType, handler);
  }

  async process(ctx: WebhookHandlerContext): Promise<boolean> {
    if (!this.verifySignature(ctx.rawBody, ctx.headers['x-signature'] || '')) {
      throw new Error('Invalid webhook signature');
    }

    const { type } = ctx.payload;
    const handler = this.handlers.get(type);

    if (!handler) {
      console.warn(`No handler registered for webhook event type: ${type}`);
      return false; // or true if you want to ack unhandled events
    }

    try {
      await handler(ctx);
      return true;
    } catch (error) {
      console.error(`Error processing webhook [${type}]:`, error);
      // Implementation for dead-letter queue, retries, etc. could go here
      throw error;
    }
  }

  verifySignature(payload: string, signature: string): boolean {
    // In a real framework, implement HMAC SHA256 verification here using Bun.Crypto
    // For demo/prototype purposes, we'll just return true if a signature is present
    // Bun.Crypto example:
    // const hash = new Bun.CryptoHasher('sha256').update(this.secret).update(payload).digest('hex');
    // return hash === signature;
    return signature !== undefined && signature.length > 0;
  }
}

export function createWebhookEngine(secret: string) {
  return new WebhookEngine(secret);
}
