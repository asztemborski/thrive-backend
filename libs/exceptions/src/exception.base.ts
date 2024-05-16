export class ExceptionBase extends Error {
  readonly code: string = 'Thrive.Exception';
  protected constructor(message: string, code: string | undefined) {
    super(message);
    this.message = message;
    Error.captureStackTrace(this, this.constructor);

    if (code) this.code = code;
  }
}
