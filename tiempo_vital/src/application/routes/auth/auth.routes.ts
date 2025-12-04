import { Hono } from "hono";
import { loginController, registerController } from "../../controllers/auth/auth.controller";

export const AuthRoutes = new Hono();

// POST /auth/login
AuthRoutes.post("/login", loginController);

// POST /auth/register
AuthRoutes.post("/register", registerController);