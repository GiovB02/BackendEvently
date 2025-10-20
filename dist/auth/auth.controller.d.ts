import { AuthService } from './auth.service';
import { User } from '../models/evently.models';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: Pick<User, 'email' | 'displayName'> & {
        password: string;
    }): Promise<User>;
    login(body: Pick<User, 'email'> & {
        password: string;
    }): Promise<{
        token: string;
    }>;
}
