import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateCommand } from './validate.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ITokenService } from '../../contracts';
import { UserClaimsDto } from '../../dtos';

@CommandHandler(ValidateCommand)
export class ValidateCommandHandler implements ICommandHandler<ValidateCommand> {
  constructor(@Inject(ITokenService) private readonly tokenService: ITokenService) {}

  async execute(command: ValidateCommand): Promise<UserClaimsDto> {
    if (!command.token) {
      throw new UnauthorizedException();
    }

    try {
      return await this.tokenService.verify(command.token);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
