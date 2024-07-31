import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TypedConfigModule } from 'nest-typed-config';

import { AuthController } from './auth.controller';
import { configOptions } from './config/auth.config';
import { serviceProviders } from './services';
import { AccountModule } from '../account/account.module';
import { commandHandlers } from './commands';

@Module({
  imports: [TypedConfigModule.forRoot(configOptions), CqrsModule, JwtModule, forwardRef(() => AccountModule)],
  controllers: [AuthController],
  providers: [...serviceProviders, ...commandHandlers],
  exports: [...serviceProviders],
})
export class AuthModule {}
