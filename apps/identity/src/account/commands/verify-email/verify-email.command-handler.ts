import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { Inject, Logger } from '@nestjs/common';
import { IAccountRepository } from '../../contracts';
import { REDIS_CLIENT } from '@libs/redis/redis.di-tokens';
import Redis from 'ioredis';
import { UnauthorizedException } from '../../../auth/exceptions';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler implements ICommandHandler<VerifyEmailCommand> {
  private readonly logger = new Logger(VerifyEmailCommandHandler.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(IAccountRepository) private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<void> {
    const accountId = await this.redis.getdel(`email-verification-${command.token}`);

    if (!accountId) {
      throw new UnauthorizedException();
    }

    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new UnauthorizedException();
    }

    account.confirmEmailAddress();
    await this.accountRepository.update(account);

    this.logger.log(`Account ${account.id} successfully verified`);
  }
}
