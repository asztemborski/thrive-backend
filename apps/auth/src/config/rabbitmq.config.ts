import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export const RABBITMQ_CONFIG_TOKEN = 'rabbitmq';

export interface RabbitmqConfig {
  queue: string;
  url: string;
  host: string;
  user: string;
  password: string;
}

export default registerAs(RABBITMQ_CONFIG_TOKEN, () => ({
  queue: process.env.AUTH_QUEUE,
  url: process.env.RABBITMQ_URL,
  host: process.env.RABBITMQ_HOST,
  user: process.env.RABBITMQ_USER,
  password: process.env.RABBITMQ_PASS,
}));
