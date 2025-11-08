import type { Request } from 'express';
import { PlansService } from './plans.service';
import { Plan } from '../models/evently.models';
import { CreatePlanDto } from './dto/create-plan.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(req: Request, createPlanDto: CreatePlanDto): Promise<Plan>;
    myPlans(req: Request): Promise<Plan[]>;
}
