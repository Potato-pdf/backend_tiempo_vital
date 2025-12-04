import { UserInterface } from "../../../types/user/user.interface";

export interface UserInterfaceCqrs {
    findAll(): Promise<UserInterface[]>;
    findById(id: string): Promise<UserInterface | null>;
    findByName(name: string): Promise<UserInterface | null>;
    create(user: UserInterface): Promise<UserInterface>;
    update(id: string, user: UserInterface): Promise<UserInterface>;
    delete(id: string): Promise<void>;
}
