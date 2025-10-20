import { User } from '../models/evently.models';
export declare class AuthService {
    register(email: string, password: string, displayName: string): Promise<User>;
    login(email: string, password: string): Promise<{
        token: string;
    }>;
}
