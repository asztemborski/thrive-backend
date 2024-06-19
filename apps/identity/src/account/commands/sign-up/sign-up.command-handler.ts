import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SignUpCommand } from './sign-up.command';
import { IAccountRepository, IValueHasher } from '../../contracts';
import { AccountConfig } from '../../config/account.config';
import {
  EmailAlreadyInUseException,
  InvalidEmailProviderException,
  UsernameAlreadyInUseException,
} from '../../exceptions';
import { Account } from '../../domain/account.entity';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @Inject(IAccountRepository) private readonly accountRepository: IAccountRepository,
    @Inject(IValueHasher) private readonly valueHasher: IValueHasher,
    private readonly config: AccountConfig,
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    const emailProvider = command.email.split('@').pop();

    if (!emailProvider || this.config.bannedEmailProviders.some((provider) => provider === emailProvider)) {
      throw new InvalidEmailProviderException(emailProvider ?? '');
    }

    const [isEmailUnique, isUsernameUnique] = await this.accountRepository.isUnique(command.email, command.username);

    if (!isEmailUnique) {
      throw new EmailAlreadyInUseException(command.email);
    }

    if (!isUsernameUnique) {
      throw new UsernameAlreadyInUseException(command.username);
    }

    const hashedPassword = await this.valueHasher.hash(command.password);
    const account = Account.create({ ...command, password: hashedPassword });
    await this.accountRepository.insert(account);
  }
}
