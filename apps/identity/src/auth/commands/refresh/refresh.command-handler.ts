import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RefreshCommand } from './refresh.command';
import { AuthTokensDto } from '../../dtos';
import { ITokenService } from '../../contracts';
import { UnauthorizedException } from '../../exceptions';
import { IAccountRepository } from '../../../account/contracts';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    @Inject(ITokenService) private readonly tokenService: ITokenService,
    @Inject(IAccountRepository) private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthTokensDto> {
    const accountId = await this.tokenService.revokeRefreshToken(command.refreshToken);

    if (!accountId) {
      throw new UnauthorizedException();
    }

    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new UnauthorizedException();
    }

    return this.tokenService.generateAccess(account);
  }
}
