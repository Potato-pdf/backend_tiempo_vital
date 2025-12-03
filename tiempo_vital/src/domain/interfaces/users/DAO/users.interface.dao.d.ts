import { UserInterface } from "../../../types/user/user.interface";

export interface UsersInterfaceDao {
    findAll(): Promise<UserInterface[]>;
    findById(id: string): Promise<UserInterface | null>;
    findByEmail(email: string): Promise<UserInterface | null>;
    create(user: UserInterface): Promise<UserInterface>;
    update(id: string, user: UserInterface): Promise<UserInterface>;
    delete(id: string): Promise<void>;
}