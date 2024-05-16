import { Inject, Injectable } from '@nestjs/common';

import { Mapper } from '@libs/ddd/mapper.contract';
import { User } from '../domain/entities/user.entity';
import { UserSchema } from '../database/schemas';
import { Username, Email } from '../domain/value-objects';
import { REFRESH_TOKEN_MAPPER } from '../auth.di-tokens';
import { RefreshTokenMapper } from './refresh-token-mapper';

@Injectable()
export class UserMapper implements Mapper<User, UserSchema> {
  constructor(
    @Inject(REFRESH_TOKEN_MAPPER) private readonly refreshTokenMapper: RefreshTokenMapper,
  ) {}

  toDomain(schema: UserSchema): User {
    return new User({
      ...schema,
      email: new Email({ address: schema.emailAddress, isConfirmed: schema.emailConfirmed }),
      username: new Username({ value: schema.username }),
      refreshTokens: schema.refreshTokens.map((token) => this.refreshTokenMapper.toDomain(token)),
    });
  }

  toPersistence(entity: User): UserSchema {
    const user = entity.getProperties();
    return {
      ...user,
      emailAddress: user.email.address,
      emailConfirmed: user.email.isConfirmed,
      username: user.username.value,
      refreshTokens: entity.refreshTokens.map((token) =>
        this.refreshTokenMapper.toPersistence(token),
      ),
    };
  }
}
