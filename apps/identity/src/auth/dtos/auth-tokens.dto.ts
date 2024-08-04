export class AuthTokensDto {
  readonly accessToken: string;

  readonly refreshToken: string;

  readonly expiresAt: number;
}
