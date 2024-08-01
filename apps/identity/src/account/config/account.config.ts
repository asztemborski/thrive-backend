import { Allow, IsArray, IsBoolean, IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { fileLoader, TypedConfigModuleOptions } from 'nest-typed-config';
import * as path from 'node:path';
import * as process from 'node:process';

import { DatabaseConfig } from './database.config';

export class AccountConfig {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  @IsDefined()
  readonly database: DatabaseConfig;

  @IsArray()
  @IsString({ each: true })
  @Allow()
  readonly bannedEmailProviders: string[];

  @IsString()
  @Allow()
  readonly emailVerificationUrl: string;

  @Type(() => Boolean)
  @IsBoolean()
  @Allow()
  readonly emailVerificationDisabled: boolean;
}

export const configOptions: TypedConfigModuleOptions = {
  schema: AccountConfig,
  load: fileLoader({
    basename: 'account.module',
    searchFrom: path.resolve(process.cwd(), 'apps/identity'),
    ignoreEnvironmentVariableSubstitution: false,
  }),
};
