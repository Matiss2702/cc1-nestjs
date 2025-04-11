import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.EXPRESS_PORT ?? 3001);
}
main();
