import * as path from 'path';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  if (admin.apps.length === 0) {
    try {
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      console.log('Loading Firebase credentials from:', serviceAccountPath);
      
      // Add validation
      if (!serviceAccountPath) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
      }
      
      if (!require('fs').existsSync(serviceAccountPath)) {
        throw new Error(`Firebase credentials file not found at: ${serviceAccountPath}`);
      }
      
      const serviceAccount = JSON.parse(
        readFileSync(serviceAccountPath, 'utf8')
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      process.exit(1);
    }
  }
  // Inicializa Firebase Admin SDK (usa GOOGLE_APPLICATION_CREDENTIALS)

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
