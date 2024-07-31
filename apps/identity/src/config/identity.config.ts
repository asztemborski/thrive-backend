import { RabbitmqConfig } from './rabbitmq.config';
import { Type } from 'class-transformer';
import { Allow, IsDefined, IsString, ValidateNested } from 'class-validator';
import { fileLoader, TypedConfigModuleOptions } from 'nest-typed-config';

import { RedisConfig } from './redis.config';
import * as path from 'node:path';
import * as process from 'node:process';

export class IdentityConfig {
  @Type(() => RabbitmqConfig)
  @ValidateNested()
  @IsDefined()
  readonly rabbitmq: RabbitmqConfig;

  @Type(() => RedisConfig)
  @ValidateNested()
  @IsDefined()
  readonly redis: RedisConfig;

  @IsString()
  @Allow()
  readonly frontendUrl: string;
}

export const configOptions: TypedConfigModuleOptions = {
  schema: IdentityConfig,
  load: fileLoader({
    basename: 'identity.module',
    searchFrom: path.resolve(process.cwd(), 'apps/identity'),
    ignoreEnvironmentVariableSubstitution: false,
  }),
};
