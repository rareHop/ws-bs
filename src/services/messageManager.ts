import { Message } from '../types';

class MessageManager {
  private messages: Map<string, Message>;
  private readonly maxMessages: number;

  constructor(maxMessages: number = 100) {
    this.messages = new Map();
    this.maxMessages = maxMessages;
  }

  addMessage(message: Message): void {
    if (!this.hasMessage(message.id)) {
      this.messages.set(message.id, message);
      
      // Remove oldest messages if exceeding max
      if (this.messages.size > this.maxMessages) {
        const oldestKey = Array.from(this.messages.keys())[0];
        this.messages.delete(oldestKey);
      }
    }
  }

  hasMessage(id: string): boolean {
    return this.messages.has(id);
  }

  getMessages(): Message[] {
    return Array.from(this.messages.values());
  }

  clear(): void {
    this.messages.clear();
  }
}

export default new MessageManager();