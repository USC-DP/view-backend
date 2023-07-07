import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//@ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
