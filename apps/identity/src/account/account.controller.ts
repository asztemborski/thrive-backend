import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpRequestDto } from './dtos/sign-up.request.dto';
import { SignUpCommand } from './commands/sign-up';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
}
