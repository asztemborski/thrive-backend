import { ITokenService } from '../contracts';
import { TokensService } from './tokens-service';

export const serviceProviders = [
  {
    provide: ITokenService,
    useClass: TokensService,
  },
];
