import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  theme: 'light' | 'dark';
}

export function ChatInput({ onSendMessage, theme }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="relative">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </form>
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setInput(prev => prev + emojiData.emoji);
            }}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}