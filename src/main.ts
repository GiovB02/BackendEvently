import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import * as admin from 'firebase-admin';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Inicializa Firebase Admin SDK (usa GOOGLE_APPLICATION_CREDENTIALS)
  if (admin.apps.length === 0) {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      } else {
        console.error(
          'Firebase credentials not found. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable.',
        );
      }
    } catch (e) {
      console.warn('Firebase Admin initialization skipped:', e);
    }
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe());

  // CORS: permite cualquier puerto en localhost (útil para Flutter Web)
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

void bootstrap();


