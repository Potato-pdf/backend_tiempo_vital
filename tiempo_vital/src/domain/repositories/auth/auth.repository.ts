import { UserInterface } from "../../types/user/user.interface";
import { LoginResponse } from "../../types/auth/auth.interface";

export interface AuthRepository {
    findByEmail(email: string): Promise<UserInterface | null>;
    passwordVerify(plainPassword: string, hashedPassword: string): Promise<boolean>;
    createToken(userId: string, email: string, rol: string): Promise<string>;
    login(email: string, password: string): Promise<LoginResponse>;
}

