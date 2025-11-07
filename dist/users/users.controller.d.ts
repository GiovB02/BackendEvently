import { UsersService } from './users.service';
import { User } from '../models/evently.models';
import type { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: Request): Promise<User>;
    updateMe(req: Request, body: {
        displayName?: string;
    }): Promise<User>;
    addFriend(req: Request, body: {
        friendId: string;
    }): Promise<User>;
    removeFriend(req: Request, friendId: string): Promise<User>;
    getFriends(req: Request): Promise<User[]>;
    saveEvent(req: Request, body: {
        eventId: string;
    }): Promise<User>;
    removeSavedEvent(req: Request, eventId: string): Promise<User>;
}
