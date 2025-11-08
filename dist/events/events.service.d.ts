import { Event } from '../models/evently.models';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private _db;
    private readonly logger;
    private get db();
    private createMockDb;
    createEvent(event: CreateEventDto, creatorUid: string): Promise<Event>;
    getEvent(id: string): Promise<Event>;
    getEvents(): Promise<Event[]>;
    updateEvent(id: string, event: UpdateEventDto, userId: string): Promise<Event>;
    deleteEvent(id: string, userId: string): Promise<void>;
    attendEvent(eventId: string, userId: string): Promise<Event>;
    unattendEvent(eventId: string, userId: string): Promise<Event>;
}
