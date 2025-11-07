import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import * as admin from 'firebase-admin';
import { ExpressAdapter } from '@nestjs/platform-express';
import fs from 'node:fs';
import path from 'node:path';

async function bootstrap() {
  // Initialize Firebase Admin SDK (prefers GOOGLE_APPLICATION_CREDENTIALS)
  if (admin.apps.length === 0) {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Uses Application Default Credentials when the env var is set
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      } else {
        // Fallback to local service account file for local development
        // Ensure this file is NOT committed to version control
        const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
        if (fs.existsSync(keyPath)) {
          const raw = fs.readFileSync(keyPath, 'utf-8');
          const serviceAccount = JSON.parse(raw) as admin.ServiceAccount;
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } else {
          console.warn(
            'No Firebase credentials found. Skipping initialization.',
          );
        }
      }
    } catch (e) {
      console.warn('Firebase Admin initialization skipped:', e);
    }
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors(); // Enable CORS for all routes

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
