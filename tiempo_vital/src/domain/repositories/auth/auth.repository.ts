import { User } from "../../models/users/user.model";

export interface AuthRepository{
    findByEmail(email: string): Promise<any>;
    passwordVerify(password: string) : Promise<any>;
    createToken(user:User): Promise<any>;
}
