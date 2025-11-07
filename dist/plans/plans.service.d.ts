import { Plan } from '../models/evently.models';
export declare class PlansService {
    private _db;
    private readonly logger;
    private get db();
    private createMockDb;
    createPlan(eventId: string, createdBy: string, invitedContacts: string[]): Promise<Plan>;
    getMyPlans(uid: string): Promise<Plan[]>;
}
