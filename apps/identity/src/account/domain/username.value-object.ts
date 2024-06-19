import { DomainPrimitive, ValueObject } from '@libs/ddd';
import { isEmpty } from '@libs/utilities';
import { EmptyUsernameException, UsernameIsTooShortException } from './exceptions';

export class Username extends ValueObject<string> {
  protected validate({ value }: DomainPrimitive<string>): void {
    if (isEmpty(value.trim())) {
      throw new EmptyUsernameException();
    }

    if (value.trim().length < 4) {
      throw new UsernameIsTooShortException();
    }
  }

  get value(): string {
    return this.properties.value;
  }
}
