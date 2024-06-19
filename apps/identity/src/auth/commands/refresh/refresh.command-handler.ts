import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { AuthTokensDto } from '../../dtos/auth-tokens.dto';
import { Inject } from '@nestjs/common';
import { ITokenService } from '../../contracts';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler implements ICommandHandler<RefreshCommand> {
  constructor(@Inject(ITokenService) private readonly tokenService: ITokenService) {}

  execute(command: RefreshCommand): Promise<AuthTokensDto> {
    return this.tokenService.refreshAccess(command.refreshToken);
  }
}
