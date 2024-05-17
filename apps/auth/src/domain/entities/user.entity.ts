import { AggregateRoot } from '@libs/ddd';
import { Username, Email } from '../value-objects';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenAssignedDomainEvent } from '../events';

type UserProperties = {
  email: Email;
  username: Username;
  password: string;
  refreshTokens: RefreshToken[];
};

type CreateUserProperties = {
  email: string;
  username: string;
  password: string;
};

export class User extends AggregateRoot<UserProperties> {
  static create({ email, username, password }: CreateUserProperties): User {
    const userEmail = new Email({ address: email, isConfirmed: false });
    const validatedUsername = new Username({ value: username });

    return new User({
      email: userEmail,
      username: validatedUsername,
      password,
      refreshTokens: [],
    });
  }

  assignRefreshToken(token: string, expiresAt: Date): void {
    const refreshToken = new RefreshToken({ token, expiresAt, userId: this.id });
    this.properties.refreshTokens.push(refreshToken);
    this.addEvent(
      new RefreshTokenAssignedDomainEvent({
        aggregateId: this.id,
        ...refreshToken.getProperties(),
      }),
    );
  }

  get email(): Email {
    return this.properties.email;
  }

  get username(): string {
    return this.properties.username.value;
  }

  get refreshTokens(): readonly RefreshToken[] {
    return this.properties.refreshTokens;
  }

  get password(): string {
    return this.properties.password;
  }
}
