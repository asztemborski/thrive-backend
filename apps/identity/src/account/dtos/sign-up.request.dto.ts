import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { Match } from '@libs/utilities';

const EMAIL_MIN_LENGTH = 5;
const EMAIL_MAX_LENGTH = 100;

const PASSWORD_MIN_LENGTH = 6;

export class SignUpRequestDto {
  @MaxLength(EMAIL_MAX_LENGTH)
  @MinLength(EMAIL_MIN_LENGTH)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly username: string;

  @MinLength(PASSWORD_MIN_LENGTH)
  @IsNotEmpty()
  readonly password: string;

  @Match<SignUpRequestDto>('password')
  @MinLength(PASSWORD_MIN_LENGTH)
  @IsNotEmpty()
  readonly confirmPassword: string;
}
