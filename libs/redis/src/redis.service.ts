import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

export interface IRedisService {
  getClient(options: RedisOptions): Redis;
}

@Injectable()
export class RedisService implements IRedisService {
  getClient(options: RedisOptions): Redis {
    return new Redis(options);
  }
}
