import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { Inject } from '@nestjs/common';
import { ITokenService } from '../../contracts';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(@Inject(ITokenService) private readonly tokenService: ITokenService) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.tokenService.revokeRefreshToken(command.refreshToken);
  }
}
