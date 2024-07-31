import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AuthenticateCommand } from './authenticate.command';
import { AuthTokensDto } from '../../dtos';
import { IAccountRepository, IValueHasher } from '../../../account/contracts';
import { ITokenService } from '../../contracts';
import { UnauthorizedException } from '../../exceptions';

@CommandHandler(AuthenticateCommand)
export class AuthenticateCommandHandler implements ICommandHandler<AuthenticateCommand> {
  constructor(
    @Inject(IAccountRepository) private readonly accountRepository: IAccountRepository,
    @Inject(IValueHasher) private readonly valueHasher: IValueHasher,
    @Inject(ITokenService) private readonly tokenService: ITokenService,
  ) {}

  async execute(command: AuthenticateCommand): Promise<AuthTokensDto> {
    const account = await this.accountRepository.getByEmail(command.email);

    if (!account || !account.email.isConfirmed) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.valueHasher.verify(command.password, account.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.tokenService.generateAccess(account);
  }
}
