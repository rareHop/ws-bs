export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface WebSocketEvents {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
}

export const WS_EVENTS = {
  CONNECTED: 'connected',
  MESSAGE: 'message',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  USER_UPDATED: 'userUpdated',
  SET_USERNAME: 'setUsername',
  CHAT: 'chat'
} as const;