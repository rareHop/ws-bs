import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, User } from '../types';
import { WS_EVENTS, createWebSocketMessage } from '../utils/websocket';

interface WebSocketHook {
  sendMessage: (text: string) => void;
  setUsername: (username: string) => void;
  connected: boolean;
}

export function useWebSocket(
  onMessage: (message: Message) => void,
  onUserJoin: (user: User) => void,
  onUserLeave: (user: User) => void,
  onConnect: (history: Message[]) => void,
  onClientId: (id: string) => void
): WebSocketHook {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Use window.location to get the correct WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3000`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case WS_EVENTS.CONNECTED:
            onConnect(data.data.messageHistory);
            onClientId(data.data.clientId);
            break;
          case WS_EVENTS.MESSAGE:
            onMessage(data.data);
            break;
          case WS_EVENTS.USER_JOINED:
            onUserJoin(data.data);
            break;
          case WS_EVENTS.USER_LEFT:
            onUserLeave(data.data);
            break;
          case WS_EVENTS.USER_UPDATED:
            const updatedUser = data.data;
            onUserLeave(updatedUser);
            onUserJoin(updatedUser);
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [onMessage, onUserJoin, onUserLeave, onConnect, onClientId]);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(createWebSocketMessage(WS_EVENTS.CHAT, text));
    }
  }, []);

  const setUsername = useCallback((username: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(createWebSocketMessage(WS_EVENTS.SET_USERNAME, username));
    }
  }, []);

  return { sendMessage, setUsername, connected };
}