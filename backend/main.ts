/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { loadEnv } from '#core/utils';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { version } from './package.json';

loadEnv();

async function bootstrap() {
  const adapter = new FastifyAdapter();
  //@ts-ignore
  await adapter.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      cors: true,
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.setGlobalPrefix('/v1');

  const swaggerDocConfig = new DocumentBuilder()
    .setTitle('Artos API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Auth token for all endpoints.',
      },
      'jwt',
    )
    .setVersion(version)
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerDocConfig, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, swaggerDoc, {
    customSiteTitle: 'Artos API Docs',
    customCss: '.topbar { display: none }',
  });

  await app.listen(
    Number(process.env.PORT) || 3000,
    process.env.HOST || '0.0.0.0',
  );
}

bootstrap();
