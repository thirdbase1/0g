import { EventEmitter } from 'events';

export interface EventContext {
  id: string;
  name: string;
  payload: any;
  timestamp: Date;
}

export type EventHandler = (ctx: EventContext) => Promise<void> | void;

export class EventSystem {
  private emitter = new EventEmitter();

  public subscribe(eventName: string, handler: EventHandler) {
    this.emitter.on(eventName, async (ctx: EventContext) => {
      try {
        await handler(ctx);
      } catch (error) {
        console.error(`Error handling event [${eventName}]:`, error);
        // Queue for retry logic
      }
    });
  }

  public async emit(eventName: string, payload: any) {
    const ctx: EventContext = {
      id: crypto.randomUUID(),
      name: eventName,
      payload,
      timestamp: new Date()
    };

    // Asynchronous emission
    this.emitter.emit(eventName, ctx);
  }
}

export const events = new EventSystem();
