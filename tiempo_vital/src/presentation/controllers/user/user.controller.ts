import { CreateUserRequest, UserInterface } from "../../../domain/types/user/user.interface";
import { CreateUserUseCase} from "../../../application/services/create-user.service";
import { TypeORMUserRepository } from "../../../infrestructure/repositories/user/user.repository";
import { AppDataSource } from "../../../infrestructure/db/database.connection";
import { User } from "../../../domain/models/users/user.model";

const userRepository = new TypeORMUserRepository(AppDataSource.getRepository(User));
const createUserUseCase = new CreateUserUseCase(userRepository);

export const CreateUser = async (c: any) => {
    try {
        const user_body: UserInterface = await c.req.json();
        if (!user_body.name || !user_body.email || !user_body.password || !user_body.rol) {
            c.status(400);
            return c.json({ message: "Missing required fields" });
        }

        const request: CreateUserRequest = {
            name: user_body.name,
            email: user_body.email,
            password: user_body.password,
            rol: user_body.rol,
        };

        const newUser = await createUserUseCase.execute(request);
        c.status(201);
        return c.json(newUser);
    } catch (error: any) {
        if (error.message === "User with this email already exists") {
            c.status(409);
            return c.json({ message: error.message });
        }
        c.status(500);
        return c.json({ message: "Error creating user", error: error.message });
    }
}