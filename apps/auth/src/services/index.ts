import { REFRESH_TOKEN_MAPPER, TOKENS_SERVICE, USER_MAPPER, VALUE_HASHER } from '../auth.di-tokens';
import { ValueHasher } from './value-hasher';
import { UserMapper } from './user-mapper';
import { TokensService } from './tokens-service';
import { RefreshTokenMapper } from './refresh-token-mapper';

export const serviceProviders = [
  {
    provide: VALUE_HASHER,
    useClass: ValueHasher,
  },
  {
    provide: USER_MAPPER,
    useClass: UserMapper,
  },
  {
    provide: REFRESH_TOKEN_MAPPER,
    useClass: RefreshTokenMapper,
  },
  {
    provide: TOKENS_SERVICE,
    useClass: TokensService,
  },
];
