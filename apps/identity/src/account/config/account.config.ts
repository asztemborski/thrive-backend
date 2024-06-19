import { Allow, IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DatabaseConfig } from './database.config';
import { fileLoader, TypedConfigModuleOptions } from 'nest-typed-config';
import * as path from 'node:path';
import * as process from 'node:process';

export class AccountConfig {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  @IsDefined()
  readonly database: DatabaseConfig;

  @IsArray()
  @IsString({ each: true })
  @Allow()
  readonly bannedEmailProviders: string[];
}

export const configOptions: TypedConfigModuleOptions = {
  schema: AccountConfig,
  load: fileLoader({
    basename: 'account.module',
    searchFrom: path.resolve(process.cwd(), 'apps/identity'),
    ignoreEnvironmentVariableSubstitution: false,
  }),
};
