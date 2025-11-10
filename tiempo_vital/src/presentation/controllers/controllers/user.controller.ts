import { UserInterface } from "../../../domain/types/user/user.interface";
import { AppDataSource } from "../../../infrestructure/db/database.connection"
import { User } from "../../../domain/models/users/user.model";

const UserRepository = AppDataSource.getRepository(User);
export const CreateUser = async (c: any) => {
    try {
        const user_body: UserInterface = await c.req.json();
        if (!user_body.name || !user_body.email || !user_body.password || !user_body.rol) {
            c.status(400);
            return c.json({ message: "Missing required fields" });
        }
        const existingUser = await UserRepository.findOneBy({ email: user_body.email });
        if (existingUser) {
            c.status(409);
            return c.json({ message: "User with this email already exists" });
        }
        const PasswordENcrypted = await Bun.password.hash(user_body.password);
        const UUID : string = crypto.randomUUID();
        const newUser = UserRepository.create({
            id : UUID,
            name: user_body.name,
            email: user_body.email,
            password: PasswordENcrypted,
            rol: user_body.rol
            });
        await UserRepository.save(newUser);
        c.status(201);
        return c.json(newUser);
    } catch (error) {
        c.status(500);
        return c.json({ message: "Error creating user", error });
    }
}