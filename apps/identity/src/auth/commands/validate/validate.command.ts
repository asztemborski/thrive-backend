import { ICommand } from '@nestjs/cqrs';

export class ValidateCommand implements ICommand {
  constructor(readonly token: string | undefined) {}
}
