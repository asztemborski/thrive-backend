import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SignInRequestDto, AuthTokensDto } from '../dtos';
import { SignInCommand } from '../commands/sign-in';

@Controller('tokens')
export class TokensController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('retrieve')
  async retrieve(@Body() request: SignInRequestDto): Promise<AuthTokensDto> {
    const command = new SignInCommand(request);
    return await this.commandBus.execute(command);
  }
}
