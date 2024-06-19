import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}
