import { UserQueryInterface } from "../../../domain/repositories/users/CQRS/user.query.interface";
import { UsersInterfaceDao } from "../../../domain/repositories/users/DAO/users.interface.dao";
import { UserInterface } from "../../../domain/types/user/user.interface";

export class UserQuery implements UserQueryInterface {
    private userDao: UsersInterfaceDao;

    constructor(userDao: UsersInterfaceDao) {
        this.userDao = userDao;
    }

    async findAll(): Promise<UserInterface[]> {
        return this.userDao.findAll();
    }

    async findById(id: string): Promise<UserInterface | null> {
        return this.userDao.findById(id);
    }

    async findByEmail(email: string): Promise<UserInterface | null> {
        return this.userDao.findByEmail(email);
    }
}
