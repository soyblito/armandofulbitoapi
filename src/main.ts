import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());

  app.enableCors({
    origin: ['http://api.shsoftware.com.ar:4000', 'http://localhost:3000', 'https://armandofulbito.com.ar'], // tu Next.js
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Cookie',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('CodeTasks API')
    .setDescription(
      'API para la gestión de usuarios, autenticación y contenidos',
    )
    .setVersion('1.0')
    .addBearerAuth() // Agregar autenticación con Bearer Token
    .build();

  // Corregir: Pasar el objeto `config` como segundo argumento
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port = Number(configService.get('PORT')) || 4001;
  await app.listen(port, '0.0.0.0');
  console.log(`API corriendo en puerto ${port}`);
}
bootstrap();
