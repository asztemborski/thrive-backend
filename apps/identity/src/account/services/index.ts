import { Provider } from '@nestjs/common';

import { IAccountMapper, IValueHasher } from '../contracts';
import { AccountMapper } from './account-mapper';
import { ValueHasher } from './value-hasher';

export * from './account-mapper';
export * from './value-hasher';

export const RABBITMQ_CLIENT = Symbol('__IDENTITY_RABBITMQ_CLIENT__');

export const serviceProviders: Provider[] = [
  {
    provide: IAccountMapper,
    useClass: AccountMapper,
  },
  {
    provide: IValueHasher,
    useClass: ValueHasher,
  },
];
