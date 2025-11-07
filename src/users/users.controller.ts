import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/evently.models';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.getUser(uid);
  }

  @Put('me')
  async updateMe(
    @Req() req: Request,
    @Body() body: { displayName?: string },
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return await this.usersService.updateUser(uid, {
      displayName: body.displayName,
    });
  }

  @Post('friends')
  async addFriend(
    @Req() req: Request,
    @Body() body: { friendId: string },
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.addFriend(uid, body.friendId);
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
    @Body() body: { eventId: string },
  ): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.saveEvent(uid, body.eventId);
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
