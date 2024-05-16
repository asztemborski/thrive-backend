import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenAssignedDomainEvent } from '../../domain/events';
import { REFRESH_TOKEN_REPOSITORY } from '../../auth.di-tokens';
import { IRefreshTokenRepository } from '../../contracts';

@Injectable()
export class RefreshTokenAssignedEventHandler {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  @OnEvent(RefreshTokenAssignedDomainEvent.name, { async: true, promisify: true })
  async execute(event: RefreshTokenAssignedDomainEvent): Promise<void> {
    const refreshToken = new RefreshToken({
      userId: event.aggregateId,
      token: event.token,
      expiresAt: event.expiresAt,
    });

    await this.refreshTokenRepository.insert(refreshToken);
  }
}
