import { Allow, IsDefined, IsString, ValidateNested } from 'class-validator';
import { fileLoader, TypedConfigModuleOptions } from 'nest-typed-config';
import * as path from 'node:path';
import * as process from 'node:process';
import { StringValue } from 'ms';
import { Type } from 'class-transformer';
import { RedisConfig } from './redis.config';

export class AuthConfig {
  @IsString()
  @Allow()
  readonly accessTokenSecretKey: string;

  @IsString()
  @Allow()
  readonly accessTokenExpirationTime: StringValue;

  @IsString()
  @Allow()
  readonly refreshTokenSecretKey: string;

  @IsString()
  @Allow()
  readonly refreshTokenExpirationTime: StringValue;

  @Type(() => RedisConfig)
  @ValidateNested()
  @IsDefined()
  readonly redis: RedisConfig;
}

export const configOptions: TypedConfigModuleOptions = {
  schema: AuthConfig,
  load: fileLoader({
    basename: 'auth.module',
    searchFrom: path.resolve(process.cwd(), 'apps/identity'),
    ignoreEnvironmentVariableSubstitution: false,
  }),
};
