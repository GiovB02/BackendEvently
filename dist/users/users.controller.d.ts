import { UsersService } from './users.service';
import { User } from '../models/evently.models';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddFriendDto } from './dto/add-friend.dto';
import { SaveEventDto } from './dto/save-event.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: Request): Promise<User>;
    updateMe(req: Request, updateUserDto: UpdateUserDto): Promise<User>;
    addFriend(req: Request, addFriendDto: AddFriendDto): Promise<User>;
    removeFriend(req: Request, friendId: string): Promise<User>;
    getFriends(req: Request): Promise<User[]>;
    saveEvent(req: Request, saveEventDto: SaveEventDto): Promise<User>;
    removeSavedEvent(req: Request, eventId: string): Promise<User>;
}
