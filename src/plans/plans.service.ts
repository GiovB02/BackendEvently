import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Plan } from '../models/evently.models';

@Injectable()
export class PlansService {
  private _db: admin.firestore.Firestore;
  private readonly logger = new Logger(PlansService.name);

  private get db(): admin.firestore.Firestore {
    if (this._db) {
      return this._db;
    }
    if (admin.apps.length > 0) {
      this._db = admin.firestore();
      return this._db;
    } else {
      this.logger.warn(
        'Firebase not initialized. Using mock database for PlansService.',
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
      id: 'mock-id',
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

  async createPlan(
    eventId: string,
    createdBy: string,
    invitedContacts: string[],
  ): Promise<Plan> {
    // Optional: verify event exists
    const eventDoc = await this.db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      throw new NotFoundException('Event not found');
    }

    const planData: Omit<Plan, 'id'> = {
      eventId,
      createdBy,
      invitedFriends: invitedContacts?.length ?? 0,
      status: 'active',
      invitedContacts,
    };
    const docRef = await this.db.collection('plans').add(planData);

    // Mock SMS sending (log). Replace with Twilio or provider integration.
    for (const phone of invitedContacts ?? []) {
      this.logger.log(`Sending SMS invite for event ${eventId} to ${phone}`);
    }

    return { ...(planData as Plan), id: (docRef as any).id };
  }

  async getMyPlans(uid: string): Promise<Plan[]> {
    const snapshot = await this.db
      .collection('plans')
      .where('createdBy', '==', uid)
      .get();
    return snapshot.docs.map(
      (doc) => ({ ...(doc.data() as any), id: doc.id } as Plan),
    );
  }
}
