import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { TOKENS_SERVICE, USER_REPOSITORY, VALUE_HASHER } from '../auth.di-tokens';
import { IValueHasher, ITokensService, IUserRepository } from '../contracts';
import { InvalidCredentialsException } from '../exceptions';
import { AuthTokensDto } from '../dtos';

export class SignInCommand implements ICommand {
  readonly email: string;
  readonly password: string;

  constructor(properties: SignInCommand) {
    Object.assign(this, properties);
  }
}

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(VALUE_HASHER) private readonly valueHasher: IValueHasher,
    @Inject(TOKENS_SERVICE) private readonly tokensService: ITokensService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: SignInCommand): Promise<AuthTokensDto> {
    const user = await this.userRepository.getByEmail(command.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const validPassword = await this.valueHasher.verify(command.password, user.password);

    if (!validPassword) {
      throw new InvalidCredentialsException();
    }

    const tokens = await this.tokensService.generateAccess(user);
    await user.publishEvents(this.eventEmitter);
    return tokens;
  }
}
