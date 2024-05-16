import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
