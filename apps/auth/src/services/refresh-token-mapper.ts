import { Mapper } from '@libs/ddd';
import { RefreshToken } from '../domain/entities/refresh-token.entity';
import { RefreshTokenSchema } from '../database/schemas';

export class RefreshTokenMapper implements Mapper<RefreshToken, RefreshTokenSchema> {
  toPersistence(entity: RefreshToken): RefreshTokenSchema {
    return entity.getProperties();
  }

  toDomain(schema: RefreshTokenSchema): RefreshToken {
    return new RefreshToken({ ...schema });
  }
}
