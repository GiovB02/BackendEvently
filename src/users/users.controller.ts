import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/evently.models';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddFriendDto } from './dto/add-friend.dto';
import { SaveEventDto } from './dto/save-event.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request): Promise<User> {
    // Bypassing service for testing purposes
    return {
      uid: (req as any).user.uid,
      email: 'test@example.com',
      displayName: 'Mock User',
      friends: [],
      attendingEvents: [],
      savedEvents: [],
    };
  }

  @Put('me')
  async updateMe(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Bypassing service for testing purposes
    return {
      uid: (req as any).user.uid,
      email: 'test@example.com',
      displayName: updateUserDto.displayName || 'Mock User',
      friends: [],
      attendingEvents: [],
      savedEvents: [],
    };
  }

  @Post('friends')
  async addFriend(
    @Req() req: Request,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.addFriend(uid, addFriendDto.friendId);
  }

  @Delete('friends/:friendId')
  async removeFriend(
    @Req() req: Request,
    @Param('friendId') friendId: string,
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.removeFriend(uid, friendId);
  }

  @Get('friends')
  async getFriends(@Req() req: Request): Promise<User[]> {
    const uid = (req as any).user.uid;
    return this.usersService.getFriends(uid);
  }

  // Saved events
  @Post('saved-events')
  async saveEvent(
    @Req() req: Request,
    @Body() saveEventDto: SaveEventDto,
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.saveEvent(uid, saveEventDto.eventId);
  }

  @Delete('saved-events/:eventId')
  async removeSavedEvent(
    @Req() req: Request,
    @Param('eventId') eventId: string,
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.removeSavedEvent(uid, eventId);
  }
}
