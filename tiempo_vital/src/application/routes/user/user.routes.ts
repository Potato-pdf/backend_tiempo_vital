import { Hono } from "hono";
import { CreateUser } from "../../../presentation/controllers/user/user.controller";


export const UserRoutes = new Hono();

//Create User
UserRoutes.post("/register", CreateUser);