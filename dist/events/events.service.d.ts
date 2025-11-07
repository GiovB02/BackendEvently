import { Event } from '../models/evently.models';
export declare class EventsService {
    private _db;
    private readonly logger;
    private get db();
    private createMockDb;
    createEvent(event: Event, creatorUid: string): Promise<Event>;
    getEvent(id: string): Promise<Event>;
    getEvents(): Promise<Event[]>;
    updateEvent(id: string, event: Partial<Event>, userId: string): Promise<Event>;
    deleteEvent(id: string, userId: string): Promise<void>;
    attendEvent(eventId: string, userId: string): Promise<Event>;
    unattendEvent(eventId: string, userId: string): Promise<Event>;
}
