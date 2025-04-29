import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import crypto from 'crypto';
(global as any).crypto = crypto;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // O puedes especificar dominios específicos si quieres más seguridad
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
