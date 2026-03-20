export interface Adapter {
  name: string;
  init: () => Promise<void> | void;
}

export interface TelegramAdapterConfig {
  botToken: string;
  chatId: string;
}

export class TelegramAdapter implements Adapter {
  name = 'telegram';

  constructor(private config: TelegramAdapterConfig) {}

  async init() {
    console.log(`Initialized Telegram Adapter with token: ${this.config.botToken}`);
  }

  async sendMessage(message: string): Promise<boolean> {
    const url = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  }
}

export class AdapterManager {
  private adapters: Map<string, Adapter> = new Map();

  register(adapter: Adapter) {
    this.adapters.set(adapter.name, adapter);
  }

  getAdapter<T extends Adapter>(name: string): T | undefined {
    return this.adapters.get(name) as T;
  }
}

export const adapters = new AdapterManager();
