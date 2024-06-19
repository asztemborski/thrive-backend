import { ExceptionBase } from '@libs/exceptions';
import { EMAIL_USED, INVALID_EMAIL_PROVIDER, USERNAME_USED } from './exception.codes';

export class EmailAlreadyInUseException extends ExceptionBase {
  constructor(email: string) {
    super(`Email '${email}' is already in use.`, EMAIL_USED);
  }
}

export class UsernameAlreadyInUseException extends ExceptionBase {
  constructor(username: string) {
    super(`Username '${username}' is already in use.`, USERNAME_USED);
  }
}

export class InvalidEmailProviderException extends ExceptionBase {
  constructor(provider: string) {
    super(`Email provider '${provider}' is not valid email provider.`, INVALID_EMAIL_PROVIDER);
  }
}
