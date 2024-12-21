import { WebSocketMessage, WebSocketEvents } from '../types/websocket';
import userManager from './userManager';
import messageManager from './messageManager';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectTimeout = 3000;
  private readonly url: string;
  private readonly handlers: WebSocketEvents;

  constructor(url: string, handlers: WebSocketEvents) {
    // Determine WebSocket URL based on environment
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NODE_ENV === 'production' 
      ? window.location.host
      : `${window.location.hostname}:3000`;
    this.url = `${wsProtocol}//${wsHost}`;
    this.handlers = handlers;
    
    console.log('WebSocket URL:', this.url); // Debug log
  }

  connect(): void {
    try {
      console.log('Attempting to connect to WebSocket...'); // Debug log
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      this.handlers.onConnect?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.handlers.onDisconnect?.();
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handlers.onError?.(error);
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    // Deduplicate messages and users
    switch (message.type) {
      case 'connected':
        messageManager.clear();
        userManager.clear();
        message.data.messageHistory.forEach(msg => messageManager.addMessage(msg));
        message.data.users.forEach(user => userManager.addUser(user));
        this.handlers.onMessage?.(message);
        break;
      case 'message':
        if (!messageManager.hasMessage(message.data.id)) {
          messageManager.addMessage(message.data);
          this.handlers.onMessage?.(message);
        }
        break;
      case 'userJoined':
        if (!userManager.hasUser(message.data.id)) {
          userManager.addUser(message.data);
          this.handlers.onMessage?.(message);
        }
        break;
      case 'userLeft':
        userManager.removeUser(message.data.id);
        this.handlers.onMessage?.(message);
        break;
      case 'userUpdated':
        userManager.updateUser(message.data.id, message.data);
        this.handlers.onMessage?.(message);
        break;
      default:
        this.handlers.onMessage?.(message);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      userManager.clear();
      messageManager.clear();
      this.ws.close();
      this.ws = null;
    }
  }
}

export default WebSocketService;