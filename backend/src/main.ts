import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://proud-bay-0acae0c00.2.azurestaticapps.net',
    ],
    credentials: true,
  });

  
  app.setGlobalPrefix('api');

  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
