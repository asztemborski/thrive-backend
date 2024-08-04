import { EventEmitter2 } from '@nestjs/event-emitter';

import { EntityBase } from '@libs/ddd/entity.base';
import { DomainEvent } from '@libs/ddd/domain-event.base';

export abstract class AggregateRoot<TEntityProps> extends EntityBase<TEntityProps> {
  private readonly _domainEvents: DomainEvent[] = [];

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  async publishEvents(eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(this.domainEvents.map((event) => eventEmitter.emitAsync(event.constructor.name, event)));

    this.clearEvents();
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }
}
