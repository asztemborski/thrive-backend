import { ExceptionBase } from '@libs/exceptions';
import {
  EMAIL_CONFIRMED,
  EMAIL_EMPTY,
  INVALID_EMAIL_ADDRESS,
  USERNAME_EMPTY,
  USERNAME_MIN_LENGTH,
} from './exception.codes';

export class EmptyUsernameException extends ExceptionBase {
  constructor() {
    super('Username cannot be empty.', USERNAME_EMPTY);
  }
}

export class UsernameIsTooShortException extends ExceptionBase {
  constructor() {
    super('Username must be at least 4 characters long.', USERNAME_MIN_LENGTH);
  }
}

export class EmptyEmailAddressException extends ExceptionBase {
  constructor() {
    super('Email address cannot be empty.', EMAIL_EMPTY);
  }
}

export class InvalidEmailAddressException extends ExceptionBase {
  constructor() {
    super('Email address is not valid.', INVALID_EMAIL_ADDRESS);
  }
}

export class EmailAlreadyConfirmedException extends ExceptionBase {
  constructor() {
    super('Users email is already confirmed.', EMAIL_CONFIRMED);
  }
}
