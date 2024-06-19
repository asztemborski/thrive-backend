import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypedConfigModule } from 'nest-typed-config';

import { AccountController } from './account.controller';
import { serviceProviders } from './services';
import { repositoryProviders, schema } from './database';
import { commandHandlers } from './commands';
import { DatabaseModule } from '@libs/database';
import { AccountConfig, configOptions } from './config/account.config';

@Module({
  imports: [
    TypedConfigModule.forRoot(configOptions),
    DatabaseModule.forRootAsync({
      inject: [AccountConfig],
      useFactory: ({ database }: AccountConfig) => ({
        connectionConfig: { ...database },
        options: { schema: schema },
      }),
    }),
    CqrsModule,
  ],
  controllers: [AccountController],
  providers: [...serviceProviders, ...repositoryProviders, ...commandHandlers],
  exports: [...repositoryProviders, ...serviceProviders],
})
export class AccountModule {}
