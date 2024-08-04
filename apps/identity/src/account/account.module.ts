import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypedConfigModule } from 'nest-typed-config';

import { DatabaseModule } from '@libs/database';
import { PublicAccountController } from './account.controller';
import { RABBITMQ_CLIENT, serviceProviders } from './services';
import { repositoryProviders, schema } from './database';
import { commandHandlers } from './commands';
import { AccountConfig, configOptions } from './config/account.config';
import { RabbitmqConfig } from '../config';
import { AuthModule } from '../auth/auth.module';

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
    ClientsModule.registerAsync([
      {
        imports: [RabbitmqConfig],
        name: RABBITMQ_CLIENT,
        useFactory: (rabbitmqConfig: RabbitmqConfig) => ({
          transport: Transport.RMQ,
          options: {
            urls: [rabbitmqConfig.url],
            queue: rabbitmqConfig.queue,
          },
        }),
        inject: [RabbitmqConfig],
      },
    ]),
    CqrsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [PublicAccountController],
  providers: [...serviceProviders, ...repositoryProviders, ...commandHandlers],
  exports: [...repositoryProviders, ...serviceProviders],
})
export class AccountModule {}
