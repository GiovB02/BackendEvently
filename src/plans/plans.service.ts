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
    const mockPlan: Plan = {
      id: 'mock-plan-id',
      eventId: 'mock-event-id',
      createdBy: 'mock-user-id',
      invitedFriends: 1,
      status: 'active',
      invitedContacts: ['contact1@example.com'],
    };

    const mockEventDoc = {
      get: () => Promise.resolve({ exists: true, data: () => ({ name: 'Mock Event' }) }),
    };

    const mockPlanDoc = {
      get: () => Promise.resolve({ exists: true, data: () => mockPlan }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      id: 'mock-plan-id',
    };

    const collections = {
      events: {
        doc: () => mockEventDoc,
      },
      plans: {
        doc: () => mockPlanDoc,
        where: () => collections.plans,
        get: () => Promise.resolve({ empty: false, docs: [{ data: () => mockPlan, id: 'mock-plan-id' }] }),
        add: () => Promise.resolve(mockPlanDoc),
      },
    };

    return {
      collection: (name: string) => collections[name],
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
