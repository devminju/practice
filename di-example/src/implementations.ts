import { IUserRepository, IUserService, User } from './interfaces';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async getUser(id: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async saveUser(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserById(id: string): Promise<User> {
    return this.userRepository.getUser(id);
  }

  async createUser(name: string, email: string): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    };
    await this.userRepository.saveUser(user);
    return user;
  }
} 