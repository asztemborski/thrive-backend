import { User } from '../domain/entities/user.entity';

export interface IUserRepository {
  getByEmail(email: string): Promise<User | undefined>;
  insert(user: User): Promise<void>;
  isUnique(
    email: string,
    username: string,
  ): Promise<[emailUnique: boolean, usernameUnique: boolean]>;
}
