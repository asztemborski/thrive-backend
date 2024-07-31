import { Allow, IsString } from 'class-validator';

export class RabbitmqConfig {
  @IsString()
  @Allow()
  readonly url: string;

  @IsString()
  @Allow()
  readonly queue: string;
}
