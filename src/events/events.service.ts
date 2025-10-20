import { Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Event, User } from '../models/evently.models';

@Injectable()
export class EventsService {
  private _db: admin.firestore.Firestore;
  private readonly logger = new Logger(EventsService.name);

  private get db(): admin.firestore.Firestore {
    if (this._db) {
      return this._db;
    }
    if (admin.apps.length > 0) {
      this._db = admin.firestore();
      return this._db;
    } else {
      this.logger.warn('Firebase not initialized. Using mock database for EventsService.');
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

  async createEvent(event: Event, creator: User): Promise<Event> {
    const eventData = { ...event, creator: creator.uid, attendees: [creator.uid] };
    const docRef = await this.db.collection('events').add(eventData);
    return { ...event, id: docRef.id };
  }

  async getEvent(id: string): Promise<Event> {
    const doc = await this.db.collection('events').doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Event not found');
    }
    return { ...doc.data(), id: doc.id } as Event;
  }

  async getEvents(): Promise<Event[]> {
    const snapshot = await this.db.collection('events').get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Event));
  }

  async updateEvent(id: string, event: Partial<Event>, userId: string): Promise<Event> {
    const eventToUpdate = await this.getEvent(id);
    if (eventToUpdate.creator !== userId) {
      throw new UnauthorizedException('You are not the creator of this event.');
    }
    await this.db.collection('events').doc(id).update(event);
    return this.getEvent(id);
  }

  async deleteEvent(id: string, userId: string): Promise<void> {
    const eventToDelete = await this.getEvent(id);
    if (eventToDelete.creator !== userId) {
      throw new UnauthorizedException('You are not the creator of this event.');
    }
    await this.db.collection('events').doc(id).delete();
  }

  async attendEvent(eventId: string, userId: string): Promise<Event> {
    await this.db.collection('events').doc(eventId).update({
      attendees: admin.firestore.FieldValue.arrayUnion(userId),
    });
    return this.getEvent(eventId);
  }

  async unattendEvent(eventId: string, userId: string): Promise<Event> {
    await this.db.collection('events').doc(eventId).update({
      attendees: admin.firestore.FieldValue.arrayRemove(userId),
    });
    return this.getEvent(eventId);
  }
}
