import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { fileLoader, TypedConfigModuleOptions } from 'nest-typed-config';

import { RabbitmqConfig } from './rabbitmq.config';
import { MailConfig } from '../mail/config';
import * as path from 'node:path';
import * as process from 'node:process';

export class NotificationsConfig {
  @Type(() => RabbitmqConfig)
  @ValidateNested()
  @IsDefined()
  readonly rabbitmq: RabbitmqConfig;

  @Type(() => MailConfig)
  @ValidateNested()
  @IsDefined()
  readonly mail: MailConfig;
}

export const configOptions: TypedConfigModuleOptions = {
  schema: NotificationsConfig,
  load: fileLoader({
    basename: 'notifications.module',
    searchFrom: path.resolve(process.cwd(), 'apps/notifications'),
    ignoreEnvironmentVariableSubstitution: false,
  }),
};
