import { Type } from 'class-transformer';
import { Allow, IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';

export class AuthConfig {
  @IsString()
  @Allow()
  readonly user: string;

  @IsString()
  @Allow()
  readonly pass: string;
}

export class MailConfig {
  @IsString()
  @Allow()
  readonly host: string;

  @Type(() => Number)
  @IsNumber()
  @Allow()
  readonly port: number;

  @IsString()
  @Allow()
  readonly displayName: string;

  @IsString()
  @Allow()
  readonly mail: string;

  @Type(() => AuthConfig)
  @ValidateNested()
  @IsDefined()
  readonly auth: AuthConfig;
}
