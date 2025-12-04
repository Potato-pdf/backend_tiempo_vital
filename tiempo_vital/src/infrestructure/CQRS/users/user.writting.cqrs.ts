import { UserInterfaceCqrs } from "../../../domain/repositories/users/CQRS/user.interface.cqrs";
import { UsersInterfaceDao } from "../../../domain/repositories/users/DAO/users.interface.dao";
import { UserInterface } from "../../../domain/types/user/user.interface";


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
        return this.userDao.create(user);
    }
    async update(id: string, user: UserInterface): Promise<UserInterface> {
        if (!user.name || !user.email || !user.password || !user.office) {
            throw new Error("Invalid user data");
        }
        return this.userDao.update(id, user);
    }
    delete(id: string): Promise<void> {
        return this.userDao.delete(id);
    }
}