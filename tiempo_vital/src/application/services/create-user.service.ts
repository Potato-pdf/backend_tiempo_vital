import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/models/users/user.model";
import { CreateUserRequest } from "../../domain/types/user/user.interface";

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(request: CreateUserRequest): Promise<User> {
        // Check if user exists
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await Bun.password.hash(request.password);

        // Create user
        const user = new User();
        user.id = crypto.randomUUID();
        user.name = request.name;
        user.email = request.email;
        user.password = hashedPassword;
        user.rol = request.rol;

        // Save user
        return await this.userRepository.save(user);
    }
}