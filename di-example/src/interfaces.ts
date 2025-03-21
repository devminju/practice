export interface IUserRepository {
  getUser(id: string): Promise<User>;
  saveUser(user: User): Promise<void>;
}

export interface IUserService {
  getUserById(id: string): Promise<User>;
  createUser(name: string, email: string): Promise<User>;
}

export interface User {
  id: string;
  name: string;
  email: string;
} 