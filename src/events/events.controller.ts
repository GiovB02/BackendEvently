import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import type { Event } from '../models/evently.models';
import type { Request } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Req() req: Request,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.createEvent(createEventDto, uid);
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
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.updateEvent(id, updateEventDto, uid);
  }

  @Delete(':id')
  async deleteEvent(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const uid = (req as any).user.uid;
    return this.eventsService.deleteEvent(id, uid);
  }

  @Post(':id/attend')
  async attendEvent(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.attendEvent(id, uid);
  }

  @Delete(':id/attend')
  async unattendEvent(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Event> {
    const uid = (req as any).user.uid;
    return this.eventsService.unattendEvent(id, uid);
  }
}
