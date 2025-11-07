import type { Request } from 'express';
import { PlansService } from './plans.service';
import { Plan } from '../models/evently.models';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(req: Request, body: {
        eventId: string;
        invitedContacts: string[];
    }): Promise<Plan>;
    myPlans(req: Request): Promise<Plan[]>;
}
