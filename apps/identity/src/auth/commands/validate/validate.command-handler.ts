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

    if (!command.token.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const accessToken = command.token.substring(7);

    try {
      return await this.tokenService.verify(accessToken);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
