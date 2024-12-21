import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { LoginForm } from './components/LoginForm';
import { ChatRoom } from './components/ChatRoom';
import { Theme } from './types';

function App() {
  const [theme, setTheme] = useState<Theme>(() => 
    (Cookies.get('theme') as Theme) || 'light'
  );
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    Cookies.set('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!username ? (
        <LoginForm onLogin={setUsername} />
      ) : (
        <ChatRoom
          username={username}
          theme={theme}
          onThemeToggle={toggleTheme}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;