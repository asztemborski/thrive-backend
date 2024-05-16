import { eq, or } from 'drizzle-orm';

import { DATABASE_CLIENT } from '@libs/database';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../../services/user-mapper';
import { IUserRepository } from '../../contracts';
import { USER_MAPPER } from '../../auth.di-tokens';
import { Database, users } from '../schemas';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(DATABASE_CLIENT) private readonly database: Database,
    @Inject(USER_MAPPER) private readonly userMapper: UserMapper,
  ) {}

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.database.query.users.findFirst({
      where: (user) => eq(user.emailAddress, email),
      with: {
        refreshTokens: true,
      },
    });

    return user ? this.userMapper.toDomain(user) : undefined;
  }

  async insert(user: User): Promise<void> {
    const userSchema = this.userMapper.toPersistence(user);
    await this.database.insert(users).values({ ...userSchema });
  }

  async isUnique(
    email: string,
    username: string,
  ): Promise<[emailUnique: boolean, usernameUnique: boolean]> {
    const user = await this.database.query.users.findFirst({
      where: (user) => or(eq(user.emailAddress, email), eq(user.username, username)),
    });

    return user ? [user.emailAddress !== email, user.username !== username] : [true, true];
  }
}
