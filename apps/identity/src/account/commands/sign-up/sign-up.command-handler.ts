import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

import { SignUpCommand } from './sign-up.command';
import { IAccountRepository, IValueHasher } from '../../contracts';
import { AccountConfig } from '../../config/account.config';
import {
  EmailAlreadyInUseException,
  InvalidEmailProviderException,
  UsernameAlreadyInUseException,
} from '../../exceptions';
import { Account } from '../../domain/account.entity';
import { ITokenService } from '../../../auth/contracts';
import { IdentityConfig } from '../../../config';
import { RABBITMQ_CLIENT } from '../../services';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  private readonly logger = new Logger(SignUpCommandHandler.name);

  constructor(
    @Inject(IAccountRepository) private readonly accountRepository: IAccountRepository,
    @Inject(IValueHasher) private readonly valueHasher: IValueHasher,
    @Inject(ITokenService) private readonly tokenService: ITokenService,
    @Inject(RABBITMQ_CLIENT) private readonly rabbitmqClient: ClientProxy,
    private readonly config: AccountConfig,
    private readonly identityConfig: IdentityConfig,
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

    this.logger.log(`Created new account with email address: ${account.email.address}`);

    if (this.config.emailVerificationDisabled) {
      account.confirmEmailAddress();
      await this.accountRepository.update(account);
      return this.logger.warn(
        `Email verification disabled. Skipped verification process for user: ${account.email.address}`,
      );
    }

    const emailVerificationToken = await this.tokenService.generateEmailVerificationToken(account);
    const { frontendUrl } = this.identityConfig;
    const { emailVerificationUrl } = this.config;

    this.rabbitmqClient.emit('user_created', {
      username: account.username,
      email: account.email.address,
      url: `${frontendUrl}/${emailVerificationUrl}/${emailVerificationToken}`,
    });
  }
}
