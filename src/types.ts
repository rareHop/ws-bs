export interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
}

export type Theme = 'light' | 'dark';