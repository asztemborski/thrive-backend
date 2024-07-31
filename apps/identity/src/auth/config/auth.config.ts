import { Allow, IsString } from 'class-validator';
import { fileLoader, TypedConfigModuleOptions } from 'nest-typed-config';
import { StringValue } from 'ms';

import * as path from 'node:path';
import * as process from 'node:process';

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

  @IsString()
  @Allow()
  readonly emailVerificationTokenExpirationTime: StringValue;
}

export const configOptions: TypedConfigModuleOptions = {
  schema: AuthConfig,
  load: fileLoader({
    basename: 'auth.module',
    searchFrom: path.resolve(process.cwd(), 'apps/identity'),
    ignoreEnvironmentVariableSubstitution: false,
  }),
};
