import { ConfigurableModuleBuilder } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RedisOptions>().build();
