// WebSocket message types
export const WS_EVENTS = {
  CONNECTED: 'connected',
  MESSAGE: 'message',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  USER_UPDATED: 'userUpdated',
  SET_USERNAME: 'setUsername',
  CHAT: 'chat'
} as const;

export type WebSocketEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS];

// Helper to create WebSocket messages
export function createWebSocketMessage(type: WebSocketEvent, data: any) {
  return JSON.stringify({ type, data });
}