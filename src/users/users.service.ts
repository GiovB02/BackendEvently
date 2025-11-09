import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from '../models/evently.models';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private _db: admin.firestore.Firestore;
  private readonly logger = new Logger(UsersService.name);

  private get db(): admin.firestore.Firestore {
    if (this._db) {
      return this._db;
    }

    if (admin.apps.length > 0) {
      this._db = admin.firestore();
      return this._db;
    } else {
      this.logger.warn(
        'Firebase not initialized. Using mock database for UsersService.',
      );
      // Return a mock object that won't crash the app
      return this.createMockDb() as any;
    }
  }

  private createMockDb() {
    const mockDoc = {
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    };
    const mockCollection = {
      doc: () => mockDoc,
      where: () => mockCollection,
      get: () => Promise.resolve({ empty: true, docs: [] }),
      add: () => Promise.resolve(mockDoc),
    };
    return {
      collection: () => mockCollection,
    };
  }

  async getUser(uid: string): Promise<User> {
    const userDoc = await this.db.collection('users').doc(uid).get();
    return userDoc.data() as User;
  }

  async updateUser(uid: string, data: UpdateUserDto): Promise<User> {
    if (data.displayName !== undefined) {
      // Update display name in Firebase Auth
      await admin.auth().updateUser(uid, { displayName: data.displayName });

      // Reflect change in Firestore user document
      await this.db
        .collection('users')
        .doc(uid)
        .update({ displayName: data.displayName });
    }

    const user = await this.getUser(uid);
    if (!user) {
      throw new (require('@nestjs/common').NotFoundException)(`User with uid ${uid} not found`);
    }
    return user;
  }

  async addFriend(uid: string, friendId: string): Promise<User> {
    await this.db
      .collection('users')
      .doc(uid)
      .update({
        friends: admin.firestore.FieldValue.arrayUnion(friendId),
      });
    return this.getUser(uid);
  }

  async removeFriend(uid: string, friendId: string): Promise<User> {
    await this.db
      .collection('users')
      .doc(uid)
      .update({
        friends: admin.firestore.FieldValue.arrayRemove(friendId),
      });
    return this.getUser(uid);
  }

  async getFriends(uid: string): Promise<User[]> {
    const user = await this.getUser(uid);
    if (!user.friends || user.friends.length === 0) {
      return [];
    }
    const friendsSnapshot = await this.db
      .collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', user.friends)
      .get();
    return friendsSnapshot.docs.map((doc) => doc.data() as User);
  }

  async saveEvent(uid: string, eventId: string): Promise<User> {
    await this.db
      .collection('users')
      .doc(uid)
      .update({
        savedEvents: admin.firestore.FieldValue.arrayUnion(eventId),
      });
    return this.getUser(uid);
  }

  async removeSavedEvent(uid: string, eventId: string): Promise<User> {
    await this.db
      .collection('users')
      .doc(uid)
      .update({
        savedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
      });
    return this.getUser(uid);
  }
}
