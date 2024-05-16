import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { StringValue } from 'ms';

import * as config from '../../auth.config.json';

export const JWT_CONFIG_TOKEN = 'jwt';

export interface JwtConfig {
  accessTokenExpirationTime: StringValue;
  accessTokenSecretKey: string;
  refreshTokenExpirationTime: StringValue;
  refreshTokenSecretKey: string;
}

export default registerAs(JWT_CONFIG_TOKEN, () => ({
  accessTokenExpirationTime: config.jwtConfig.accessTokenExpirationTime,
  accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenExpirationTime: config.jwtConfig.refreshTokenExpirationTime,
  refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
}));
