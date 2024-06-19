import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
