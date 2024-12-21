import { useState, useEffect, useCallback } from 'react';
import WebSocketService from '../services/websocket';
import { Message, User } from '../types';
import { WS_EVENTS } from '../types/websocket';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [connected, setConnected] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  const [ws, setWs] = useState<WebSocketService | null>(null);

  useEffect(() => {
    // Use window.location.host for WebSocket connection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}`;
    
    const websocket = new WebSocketService(wsUrl, {
      onConnect: () => {
        console.log('Connected to WebSocket server');
        setConnected(true);
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket server');
        setConnected(false);
      },
      onMessage: (message) => {
        switch (message.type) {
          case WS_EVENTS.CONNECTED:
            setMessages(message.data.messageHistory);
            setClientId(message.data.clientId);
            break;
          case WS_EVENTS.MESSAGE:
            setMessages(prev => {
              // Prevent duplicate messages by checking ID
              if (prev.some(msg => msg.id === message.data.id)) {
                return prev;
              }
              return [...prev, message.data];
            });
            break;
          case WS_EVENTS.USER_JOINED:
            setUsers(prev => {
              // Prevent duplicate users
              if (prev.some(user => user.id === message.data.id)) {
                return prev;
              }
              return [...prev, message.data];
            });
            break;
          case WS_EVENTS.USER_LEFT:
            setUsers(prev => prev.filter(user => user.id !== message.data.id));
            break;
          case WS_EVENTS.USER_UPDATED:
            setUsers(prev => prev.map(user => 
              user.id === message.data.id ? message.data : user
            ));
            break;
        }
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    websocket.connect();
    setWs(websocket);

    return () => websocket.disconnect();
  }, []);

  const sendMessage = useCallback((text: string) => {
    ws?.send({ type: WS_EVENTS.CHAT, data: text });
  }, [ws]);

  const setUsername = useCallback((username: string) => {
    ws?.send({ type: WS_EVENTS.SET_USERNAME, data: username });
  }, [ws]);

  return {
    messages,
    users,
    connected,
    clientId,
    sendMessage,
    setUsername
  };
}