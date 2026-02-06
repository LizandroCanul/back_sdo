import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURACIÓN DE VALIDACIÓN GLOBAL
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina datos basura que no estén en los DTOs
      forbidNonWhitelisted: true, // Tira error si mandan campos que no existen
      transform: true, // ¡CRUCIAL! Convierte los JSONs a instancias de DTO (necesario para el mapa)
    }),
  );

  // CONFIGURACIÓN DE CORS (Para que el Frontend no sea bloqueado)
  app.enableCors({
    origin: '*', // Permite conexiones desde cualquier lugar (útil en desarrollo)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
}
bootstrap();