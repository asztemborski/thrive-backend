import { v4 as uuid } from 'uuid';

import { isEmpty } from '@libs/utilities';

export type DomainEventProps<T> = Omit<T, 'id'> & {
  aggregateId: string;
};

export abstract class DomainEvent {
  readonly id: string;
  readonly aggregateId: string;

  protected constructor(properties: DomainEventProps<unknown>) {
    if (isEmpty(properties)) {
      throw new Error('Domain event properties must not be empty');
    }

    this.id = uuid();
    this.aggregateId = properties.aggregateId;
  }
}
