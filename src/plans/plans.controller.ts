import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PlansService } from './plans.service';
import { Plan } from '../models/evently.models';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createPlanDto: CreatePlanDto,
  ): Promise<Plan> {
    // Bypassing service for testing purposes
    return {
      id: 'mock-plan-id',
      eventId: createPlanDto.eventId,
      createdBy: (req as any).user.uid,
      invitedFriends: createPlanDto.invitedContacts?.length ?? 0,
      status: 'active',
      invitedContacts: createPlanDto.invitedContacts,
    };
  }

  @Get('me')
  async myPlans(@Req() req: Request): Promise<Plan[]> {
    const uid = (req as any).user.uid;
    return this.plansService.getMyPlans(uid);
  }
}
