import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete } from '@nestjs/common';
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

  @Post('friends')
  async addFriend(@Req() req: Request, @Body() body: { friendId: string }): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.addFriend(uid, body.friendId);
  }

  @Delete('friends/:friendId')
  async removeFriend(@Req() req: Request, @Param('friendId') friendId: string): Promise<User> {
    const uid = (req as any).user.uid;
    return this.usersService.removeFriend(uid, friendId);
  }

  @Get('friends')
  async getFriends(@Req() req: Request): Promise<User[]> {
    const uid = (req as any).user.uid;
    return this.usersService.getFriends(uid);
  }
}
