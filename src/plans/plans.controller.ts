import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { PlansService } from './plans.service';
import { AuthGuard } from '../auth/auth.guard';
import { Plan } from '../models/evently.models';

@Controller('plans')
@UseGuards(AuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // POST /plans  Body: { eventId: string, invitedContacts: string[] }
  @Post()
  async create(
    @Req() req: Request,
    @Body()
    body: { eventId: string; invitedContacts: string[] },
  ): Promise<Plan> {
    const uid = (req as any).user.uid;
    return this.plansService.createPlan(
      body.eventId,
      uid,
      body.invitedContacts ?? [],
    );
  }

  // GET /plans/me
  @Get('me')
  async myPlans(@Req() req: Request): Promise<Plan[]> {
    const uid = (req as any).user.uid;
    return this.plansService.getMyPlans(uid);
  }
}
