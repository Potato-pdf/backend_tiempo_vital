import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { LoginRequest } from "../../../domain/types/auth/auth.interface";


export class CreateLoginUseCase{
    constructor( private authRepository : AuthRepository){}

    async execute(request : LoginRequest ): Promise<any>
        
    const findByEmail = await this.authRepository.findByEmail(request.email);
        if (findByEmail) {
            throw new Error("User with this email already exists");
        }
}