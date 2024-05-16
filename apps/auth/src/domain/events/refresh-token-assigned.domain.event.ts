import { DomainEvent, DomainEventProps } from '@libs/ddd';

export class RefreshTokenAssignedDomainEvent extends DomainEvent {
  readonly token: string;
  readonly expiresAt: Date;

  constructor(properties: DomainEventProps<RefreshTokenAssignedDomainEvent>) {
    super(properties);
    Object.assign(this, properties);
  }
}
