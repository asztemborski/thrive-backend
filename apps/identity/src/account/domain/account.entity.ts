import { AggregateRoot } from '@libs/ddd';
import { Email } from './email.value-object';
import { Username } from './username.value-object';
import { EmailAlreadyConfirmedException } from './exceptions';

type AccountProperties = {
  email: Email;
  username: Username;
  password: string;
};

type CreateAccountProperties = {
  email: string;
  username: string;
  password: string;
};

export class Account extends AggregateRoot<AccountProperties> {
  static create({ email, username, password }: CreateAccountProperties): Account {
    const userEmail = new Email({ address: email, isConfirmed: false });
    const validatedUsername = new Username({ value: username });

    return new Account({
      email: userEmail,
      username: validatedUsername,
      password,
    });
  }

  confirmEmail(): void {
    if (this.email.isConfirmed) {
      throw new EmailAlreadyConfirmedException();
    }

    this.properties.email = new Email({ address: this.email.address, isConfirmed: true });
  }

  get email(): Email {
    return this.properties.email;
  }

  get username(): string {
    return this.properties.username.value;
  }

  get password(): string {
    return this.properties.password;
  }
}
