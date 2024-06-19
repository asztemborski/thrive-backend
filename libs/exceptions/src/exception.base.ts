export class ExceptionBase extends Error {
  readonly code: string;
  protected constructor(message: string, code: string | undefined) {
    super(message);
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
    this.code = code ?? 'Thrive.Exception';
  }
}
