import { Allow, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RedisConfig {
  @IsNumber()
  @Type(() => Number)
  @Allow()
  readonly port: number;

  @IsString()
  @Allow()
  readonly host: string;

  @IsString()
  @Allow()
  readonly username: string;

  @IsString()
  @Allow()
  readonly password: string;
}
