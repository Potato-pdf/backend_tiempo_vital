import { Repository } from "typeorm";
import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { User } from "../../../domain/models/users/user.model";


export class TypeORMAuthRepository implements  AuthRepository{
    constructor(private userRepository: Repository<User>){}
    
    async findByEmail(email: string): Promise<any> {
        return await this.userRepository.findOneBy({ email });
    }
    async passwordVerify(password: any): Promise<any> {
         await Bun.password.verify(this.userRepository.password, this.userRepository.password)
    }
    async createToken(user: any): Promise<any> {
        
    }
}