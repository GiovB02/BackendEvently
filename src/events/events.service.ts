import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Event } from '../models/evently.models';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

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
      this.logger.warn(
        'Firebase not initialized. Using mock database for EventsService.',
      );
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

  async createEvent(event: CreateEventDto, creatorUid: string): Promise<Event> {
    const eventData: Omit<Event, 'id'> = {
      ...event,
      creator: creatorUid,
      attendees: [creatorUid],
    };
    const docRef = await this.db.collection('events').add(eventData);
    return { ...(eventData as Event), id: docRef.id };
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
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Event);
  }

  async updateEvent(
    id: string,
    event: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const eventToUpdate = await this.getEvent(id);
    if (eventToUpdate.creator !== userId) {
      throw new UnauthorizedException('You are not the creator of this event.');
    }
    const updateData = Object.entries(event).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(updateData).length > 0) {
      await this.db.collection('events').doc(id).update(updateData);
    }

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
    await this.db
      .collection('events')
      .doc(eventId)
      .update({
        attendees: admin.firestore.FieldValue.arrayUnion(userId),
      });
    // Also update the user profile.
    await this.db
      .collection('users')
      .doc(userId)
      .update({
        attendingEvents: admin.firestore.FieldValue.arrayUnion(eventId),
      });
    return this.getEvent(eventId);
  }

  async unattendEvent(eventId: string, userId: string): Promise<Event> {
    await this.db
      .collection('events')
      .doc(eventId)
      .update({
        attendees: admin.firestore.FieldValue.arrayRemove(userId),
      });
    await this.db
      .collection('users')
      .doc(userId)
      .update({
        attendingEvents: admin.firestore.FieldValue.arrayRemove(eventId),
      });
    return this.getEvent(eventId);
  }
}
