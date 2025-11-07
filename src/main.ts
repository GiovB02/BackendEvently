import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import * as admin from 'firebase-admin';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const serviceAccount = require('../serviceAccountKey.json');

  // Conditionally initialize Firebase Admin SDK
  if (serviceAccount.project_id !== 'YOUR_PROJECT_ID') {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn(
      '***********************************************************************',
    );
    console.warn(
      '* WARNING: Firebase Admin SDK not initialized.                    *',
    );
    console.warn(
      '* Please replace the placeholder values in serviceAccountKey.json with your actual Firebase project credentials.     *',
    );
    console.warn(
      '***********************************************************************',
    );
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors(); // Enable CORS for all routes

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
