import { EventsService } from './events.service';
import type { Event } from '../models/evently.models';
import type { Request } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(req: Request, createEventDto: CreateEventDto): Promise<Event>;
    getEvents(): Promise<Event[]>;
    getEvent(id: string): Promise<Event>;
    updateEvent(req: Request, id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    deleteEvent(req: Request, id: string): Promise<void>;
    attendEvent(req: Request, id: string): Promise<Event>;
    unattendEvent(req: Request, id: string): Promise<Event>;
}
