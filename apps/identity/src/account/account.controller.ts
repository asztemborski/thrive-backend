import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SignUpRequestDto } from './dtos/sign-up.request.dto';
import { SignUpCommand } from './commands/sign-up';
import { VerifyEmailCommand } from './commands/verify-email';

@Controller({ version: '1', path: 'account' })
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiOperation({ summary: 'Registers a new user.', description: 'Register a new user based on the request.' })
  async signUp(@Body() request: SignUpRequestDto): Promise<void> {
    const command = new SignUpCommand(request);
    await this.commandBus.execute(command);
  }

  @Get('verify-email/:token')
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  async verifyEmail(@Param('token') token: string): Promise<void> {
    const command = new VerifyEmailCommand({ token });
    await this.commandBus.execute(command);
  }
}
