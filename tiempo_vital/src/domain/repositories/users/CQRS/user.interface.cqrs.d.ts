import { UserInterface } from "../../../types/user/user.interface";

export interface UserInterfaceCqrs {
    create(user: UserInterface): Promise<UserInterface>;
    update(id: string, user: UserInterface): Promise<UserInterface>;
    delete(id: string): Promise<void>;
}
