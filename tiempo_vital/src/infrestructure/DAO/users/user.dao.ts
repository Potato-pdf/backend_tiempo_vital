import { UsersInterfaceDao } from "../../../domain/repositories/users/DAO/users.interface.dao";
import { AppDataSource } from "../../db/database.connection";
import { User } from "../../../domain/models/users/user.model";
import { Repository } from "typeorm";
import { UserInterface } from "../../../domain/types/user/user.interface";



export class UserDAO implements UsersInterfaceDao {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
    }

    async findAll(): Promise<UserInterface[]> {
        const users = await this.userRepository.find({ relations: ['office'] });
        return users as unknown as UserInterface[];
    }

    async findById(id: string): Promise<UserInterface | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['office']
        });
        return user as unknown as UserInterface | null;
    }

    async findByEmail(email: string): Promise<UserInterface | null> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['office']
        });
        return user as unknown as UserInterface | null;
    }

    async create(user: UserInterface): Promise<UserInterface> {
        const savedUser = await this.userRepository.save(user as any);
        return savedUser as unknown as UserInterface;
    }

    async update(id: string, user: UserInterface): Promise<UserInterface> {
        const updatedUser = await this.userRepository.save({ id, ...user } as any);
        return updatedUser as unknown as UserInterface;
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}                   