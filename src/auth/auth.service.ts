import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from '../models/evently.models';

@Injectable()
export class AuthService {
  async register(
    email: string,
    password: string,
    displayName: string,
  ): Promise<User> {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      const user: User = {
        uid: userRecord.uid,
        email: userRecord.email ?? '',
        displayName: userRecord.displayName ?? '',
        friends: [],
      };

      await admin.firestore().collection('users').doc(userRecord.uid).set(user);

      return user;
    } catch (error) {
      if (error.code === 'app/network-timeout') {
        throw new HttpException(
          'Connection to Firebase timed out. Please check your network connection.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        'An unexpected error occurred during registration.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await admin.auth().getUserByEmail(email);
    // This is a simplified login. In a real app, you'd verify the password.
    // For this example, we'll just generate a token.
    const token = await admin.auth().createCustomToken(user.uid);
    return { token };
  }
}
