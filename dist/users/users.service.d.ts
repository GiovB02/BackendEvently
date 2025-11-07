import { User } from '../models/evently.models';
export declare class UsersService {
    private _db;
    private readonly logger;
    private get db();
    private createMockDb;
    getUser(uid: string): Promise<User>;
    updateUser(uid: string, data: {
        displayName?: string;
    }): Promise<User>;
    addFriend(uid: string, friendId: string): Promise<User>;
    removeFriend(uid: string, friendId: string): Promise<User>;
    getFriends(uid: string): Promise<User[]>;
    saveEvent(uid: string, eventId: string): Promise<User>;
    removeSavedEvent(uid: string, eventId: string): Promise<User>;
}
