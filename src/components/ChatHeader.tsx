import React from 'react';
import { Brain, Moon, Sun, LogOut } from 'lucide-react';
import { Theme } from '../types';

interface ChatHeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onLogout: () => void;
  username: string;
}

export function ChatHeader({ theme, onThemeToggle, onLogout, username }: ChatHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Last Braincell</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Welcome, {username}
          </span>
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}