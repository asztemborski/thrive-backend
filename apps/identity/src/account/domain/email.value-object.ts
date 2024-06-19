import { ValueObject } from '@libs/ddd';
import { isEmpty } from '@libs/utilities';
import { EmptyEmailAddressException, InvalidEmailAddressException } from './exceptions';

export type EmailProperties = {
  address: string;
  isConfirmed: boolean;
};

const MAIL_REGEX = /^[\w-.]+@?([\w-]+\.)+[\w-]{2,4}$/;

export class Email extends ValueObject<EmailProperties> {
  protected validate({ address }: EmailProperties): void {
    if (isEmpty(address.trim())) {
      throw new EmptyEmailAddressException();
    }

    if (!MAIL_REGEX.test(address.trim())) {
      throw new InvalidEmailAddressException();
    }
  }

  get address(): string {
    return this.properties.address;
  }

  get isConfirmed(): boolean {
    return this.properties.isConfirmed;
  }
}
