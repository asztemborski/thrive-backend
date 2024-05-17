import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

import { USER_REPOSITORY, VALUE_HASHER } from '../../auth.di-tokens';
import { IValueHasher, IUserRepository } from '../../contracts';
import {
  EmailAlreadyInUseException,
  InvalidEmailProviderException,
  UsernameAlreadyInUseException,
} from '../../exceptions';
import { User } from '../../domain/entities/user.entity';
import { EMAIL_CONFIG_TOKEN, EmailConfig } from '../../config';
import { SignUpCommand } from './sign-up.command';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(VALUE_HASHER) private readonly valueHasher: IValueHasher,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    const emailProvider = command.email.split('@').pop();
    const { bannedEmailProviders } = this.configService.get<EmailConfig>(EMAIL_CONFIG_TOKEN);

    if (bannedEmailProviders.some((provider) => provider === emailProvider)) {
      throw new InvalidEmailProviderException(emailProvider);
    }

    const [isEmailUnique, isUsernameUnique] = await this.userRepository.isUnique(
      command.email,
      command.username,
    );

    if (!isEmailUnique) {
      throw new EmailAlreadyInUseException(command.email);
    }

    if (!isUsernameUnique) {
      throw new UsernameAlreadyInUseException(command.username);
    }

    const hashedPassword = await this.valueHasher.hash(command.password);
    const user = User.create({ ...command, password: hashedPassword });
    await this.userRepository.insert(user);
  }
}
