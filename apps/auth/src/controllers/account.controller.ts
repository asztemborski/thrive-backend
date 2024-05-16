import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SignUpCommand } from '../commands/sign-up.command';
import { SignUpRequestDto } from '../dtos';

@Controller('account')
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  async signUp(@Body() request: SignUpRequestDto): Promise<void> {
    const command = new SignUpCommand(request);
    await this.commandBus.execute(command);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string): Promise<void> {
    console.log(token);
  }
}
