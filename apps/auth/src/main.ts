import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExceptionInterceptor, validationPipeConfig } from '@libs/api';
import { AuthModule } from './auth.module';
import { RABBITMQ_CONFIG_TOKEN, RabbitmqConfig } from './config';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalInterceptors(new ExceptionInterceptor());

  const configService = app.get<ConfigService>(ConfigService);
  const { url, queue } = configService.get<RabbitmqConfig>(RABBITMQ_CONFIG_TOKEN);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: queue,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3101);
};

void bootstrap();
