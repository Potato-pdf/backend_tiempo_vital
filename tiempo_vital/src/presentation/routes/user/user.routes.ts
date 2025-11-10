import { Hono } from "hono";
import { CreateUser } from "../../controllers/controllers/user.controller";


export const UserRoutes = new Hono();

//Create User
UserRoutes.post("/register", CreateUser);