import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ITokenService } from '../../contracts';
import { LogoutAllCommand } from './logout-all.command';

@CommandHandler(LogoutAllCommand)
export class LogoutAllCommandHandler implements ICommandHandler<LogoutAllCommand> {
  constructor(@Inject(ITokenService) private readonly tokenService: ITokenService) {}

  async execute(command: LogoutAllCommand): Promise<void> {
    await this.tokenService.revokeAllRefreshTokens(command.accountId);
  }
}
