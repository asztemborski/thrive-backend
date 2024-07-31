import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { ExceptionInterceptor, validationPipeConfig } from '@libs/api';
import { IdentityModule } from './identity.module';
import { IdentityConfig } from './config';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(IdentityModule);
  const config = app.get<IdentityConfig>(IdentityConfig);
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalInterceptors(new ExceptionInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Identity service')
    .setDescription('Identity service for thrive application')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  app.enableCors({
    origin: config.frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3101);
};

void bootstrap();
