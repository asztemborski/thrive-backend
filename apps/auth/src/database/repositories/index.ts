import { REFRESH_TOKEN_REPOSITORY, USER_REPOSITORY } from '../../auth.di-tokens';
import { UserRepository } from './user.repository';
import { RefreshTokenRepository } from './refresh-token.repository';

export const repositoryProviders = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: REFRESH_TOKEN_REPOSITORY,
    useClass: RefreshTokenRepository,
  },
];
