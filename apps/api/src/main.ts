import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root (two levels up from apps/api)
// Using process.cwd() since npm runs from apps/api directory
config({ path: resolve(process.cwd(), '../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
