import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { NotificationsModule } from './notifications.module';
import { RabbitmqConfig } from './config';

const bootstrap = async (): Promise<void> => {
  const ctx = await NestFactory.createApplicationContext(NotificationsModule);
  const rabbitmqConfig = ctx.get<RabbitmqConfig>(RabbitmqConfig);
  await ctx.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationsModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqConfig.url],
      queue: rabbitmqConfig.queue,
    },
  });

  await app.listen();
};

void bootstrap();
