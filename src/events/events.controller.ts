import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import type { Event } from '../models/evently.models';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Req() req: Request, @Body() event: Event): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.createEvent(event, uid);
  }

  @Get()
  async getEvents(): Promise<Event[]> {
    return this.eventsService.getEvents();
  }

  @Get(':id')
  async getEvent(@Param('id') id: string): Promise<Event> {
    return this.eventsService.getEvent(id);
  }

  @Post(':id')
  async updateEvent(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() event: Event,
  ): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.updateEvent(id, event, uid);
  }

  @Delete(':id')
  async deleteEvent(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const uid = (req as any).user.uid;
    return this.eventsService.deleteEvent(id, uid);
  }

  @Post(':id/attend')
  async attendEvent(@Req() req: Request, @Param('id') id: string): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.attendEvent(id, uid);
  }

  @Post(':id/unattend')
  async unattendEvent(@Req() req: Request, @Param('id') id: string): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.unattendEvent(id, uid);
  }
}
