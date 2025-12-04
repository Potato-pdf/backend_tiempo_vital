import { UserInterface } from "../../../types/user/user.interface";

export interface UserQueryInterface {
    findAll(): Promise<UserInterface[]>;
    findById(id: string): Promise<UserInterface | null>;
    findByEmail(email: string): Promise<UserInterface | null>;
}
