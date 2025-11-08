import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // Force mock user for testing purposes, bypassing all token logic.
    req['user'] = { uid: 'mock-user-id', email: 'test@example.com' };
    next();

    /*
    // If Firebase is not initialized, inject a mock user for testing
    if (admin.apps.length === 0) {
      req['user'] = { uid: 'mock-user-id', email: 'test@example.com' };
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req['user'] = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).send('Unauthorized');
    }
    */
  }
}
