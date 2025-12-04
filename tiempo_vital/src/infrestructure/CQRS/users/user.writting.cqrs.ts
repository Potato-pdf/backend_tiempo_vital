import { UserInterfaceCqrs } from "../../../domain/repositories/users/CQRS/user.interface.cqrs";
import { UsersInterfaceDao } from "../../../domain/repositories/users/DAO/users.interface.dao";
import { UserInterface } from "../../../domain/types/user/user.interface";
import { randomUUID } from "crypto";

export class UserCQRS implements UserInterfaceCqrs {
    private userDao: UsersInterfaceDao;
    constructor(userDao: UsersInterfaceDao) {
        this.userDao = userDao;
    }
    async create(user: UserInterface): Promise<UserInterface> {
        if (!user.name || !user.email || !user.password || !user.office) {
            throw new Error("Invalid user data");
        }
        const hashedPassword = await Bun.password.hash(user.password);
        user.password = hashedPassword;
        user.id = randomUUID();
        return this.userDao.create(user);
    }
    async update(id: string, user: UserInterface): Promise<UserInterface> {
        if (!user.name || !user.email || !user.password || !user.office) {
            throw new Error("Invalid user data");
        }
        user.id = id;
        return this.userDao.update(id, user);
    }
    async delete(id: string): Promise<void> {
        return this.userDao.delete(id);
    }
}