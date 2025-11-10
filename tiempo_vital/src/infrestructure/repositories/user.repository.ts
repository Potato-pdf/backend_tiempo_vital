import { Repository } from "typeorm";
import { User } from "../../domain/models/users/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";

export class TypeORMUserRepository implements UserRepository {
    constructor(private userRepository: Repository<User>) {}

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }

    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}