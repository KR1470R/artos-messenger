import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from '#core/utils';

loadEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
