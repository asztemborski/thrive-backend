export class MailDto {
  readonly subject: string;

  readonly templateDirectory: string;

  readonly templateContext: Record<string, any>;

  constructor(properties: MailDto) {
    Object.assign(this, properties);
  }
}
