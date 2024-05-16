import { User } from '../domain/entities/user.entity';
import { AuthTokensDto } from '../dtos';

export interface ITokensService {
  generateAccess(user: User): Promise<AuthTokensDto>;
}
