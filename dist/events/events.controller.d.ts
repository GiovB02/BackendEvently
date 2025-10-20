import { EventsService } from './events.service';
import type { Event } from '../models/evently.models';
import type { Request } from 'express';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(req: Request, event: Event): Promise<Event>;
    getEvents(): Promise<Event[]>;
    getEvent(id: string): Promise<Event>;
    updateEvent(req: Request, id: string, event: Event): Promise<Event>;
    deleteEvent(req: Request, id: string): Promise<void>;
    attendEvent(req: Request, id: string): Promise<Event>;
    unattendEvent(req: Request, id: string): Promise<Event>;
}
