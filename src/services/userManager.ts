import { User } from '../types';

class UserManager {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  removeUser(userId: string): void {
    this.users.delete(userId);
  }

  hasUser(userId: string): boolean {
    return this.users.has(userId);
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(userId: string, userData: Partial<User>): void {
    const existingUser = this.users.get(userId);
    if (existingUser) {
      this.users.set(userId, { ...existingUser, ...userData });
    }
  }

  clear(): void {
    this.users.clear();
  }
}

export default new UserManager();