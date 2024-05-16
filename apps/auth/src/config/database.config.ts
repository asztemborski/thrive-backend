import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export const DATABASE_CONFIG_TOKEN = 'database';

export interface DatabaseConfig {
  port: number;
  host: string;
  database: string;
  username: string;
  password: string;
}

export default registerAs(DATABASE_CONFIG_TOKEN, () => ({
  port: parseInt(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_NAME,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
}));
