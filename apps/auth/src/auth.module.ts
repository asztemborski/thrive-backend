import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DatabaseModule } from '@libs/database';
import { AccountController } from './controllers/account.controller';
import { schema } from './database/schemas';
import { TokensController } from './controllers/tokens.controller';
import { commandHandlers } from './commands';
import { serviceProviders } from './services';
import { AuthController } from './controllers/auth.controller';
import { configs } from './config';
import databaseConfig from './config/database.config';
import { repositoryProviders } from './database/repositories';
import { eventHandlers } from './events/handlers';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...configs],
    }),
    DatabaseModule.forRoot({
      connectionConfig: { ...databaseConfig() },
      options: { schema: schema },
    }),
    EventEmitterModule.forRoot(),
    JwtModule,
    CqrsModule,
  ],
  controllers: [AccountController, TokensController, AuthController],
  providers: [...serviceProviders, ...repositoryProviders, ...commandHandlers, ...eventHandlers],
})
export class AuthModule {}
