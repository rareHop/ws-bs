import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { UsersList } from './UsersList';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SearchBar } from './SearchBar';
import { Theme } from '../types';
import { useChat } from '../hooks/useChat';

interface ChatRoomProps {
  username: string;
  theme: Theme;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export function ChatRoom({ username, theme, onThemeToggle, onLogout }: ChatRoomProps) {
  const { messages, users, connected, clientId, sendMessage, setUsername } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (username && connected) {
      setUsername(username);
    }
  }, [username, connected, setUsername]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!connected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connecting to chat server...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader
        theme={theme}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        username={username}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <UsersList users={users} />
        </div>
        <div className="flex-1 flex flex-col">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <MessageList messages={filteredMessages} currentUserId={clientId} />
          <div ref={messagesEndRef} />
          <ChatInput onSendMessage={sendMessage} theme={theme} />
        </div>
      </div>
    </div>
  );
}