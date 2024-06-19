import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TypedConfigModule } from 'nest-typed-config';

import { AuthController } from './auth.controller';
import { RedisModule } from '@libs/redis';
import { configOptions } from './config/auth.config';
import { serviceProviders } from './services';
import { AccountModule } from '../account/account.module';
import { commandHandlers } from './commands';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [
    TypedConfigModule.forRoot(configOptions),
    RedisModule.forRootAsync({
      inject: [RedisConfig],
      useFactory: (redisConfig: RedisConfig) => redisConfig,
    }),
    CqrsModule,
    JwtModule,
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [...serviceProviders, ...commandHandlers],
})
export class AuthModule {}
