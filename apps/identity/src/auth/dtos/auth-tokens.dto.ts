import { IsNotEmpty } from 'class-validator';

export class AuthTokensDto {
  @IsNotEmpty()
  readonly accessToken: string;

  @IsNotEmpty()
  readonly refreshToken: string;
}
