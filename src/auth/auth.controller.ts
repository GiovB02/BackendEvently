import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../models/evently.models';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: Pick<User, 'email' | 'displayName'> & { password: string },
  ): Promise<User> {
    return this.authService.register(
      body.email,
      body.password,
      body.displayName,
    );
  }

  @Post('login')
  async login(
    @Body() body: Pick<User, 'email'> & { password: string },
  ): Promise<{ token: string }> {
    return this.authService.login(body.email, body.password);
  }
}
