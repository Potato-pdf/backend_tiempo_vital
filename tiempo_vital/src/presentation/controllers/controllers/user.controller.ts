import { UserInterface } from "../../../domain/types/user/user.interface";
import { AppDataSource } from "../../../infrestructure/db/database.connection"

const UserRepository = AppDataSource.getRepository("User");
export const CreateUser = async (c: any) => {
    try {
        const user_body: UserInterface = await c.req.json();
        if (!user_body.name || !user_body.email || !user_body.password || !user_body.rol) {
            c.status(400);
            return c.json({ message: "Missing required fields" });
        }
        const newUser = UserRepository.create(user_body);
        await UserRepository.save(newUser);
        c.status(201);
        return c.json(newUser);
    } catch (error) {
        c.status(500);
        return c.json({ message: "Error creating user", error });
    }
}