import React from 'react';
import { Users } from 'lucide-react';
import { User } from '../types';

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Online Users</h2>
      </div>
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}