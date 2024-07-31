import { Module } from '@nestjs/common';
import { TypedConfigModule } from 'nest-typed-config';

import { RedisModule } from '@libs/redis';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { configOptions, RedisConfig } from './config';

@Module({
  imports: [
    TypedConfigModule.forRoot(configOptions),
    RedisModule.forRootAsync({
      inject: [RedisConfig],
      useFactory: (redisConfig: RedisConfig) => redisConfig,
    }),
    AccountModule,
    AuthModule,
  ],
})
export class IdentityModule {}
