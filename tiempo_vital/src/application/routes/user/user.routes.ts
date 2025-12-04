import { Hono } from "hono";
import {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController
} from "../../controllers/user/user.controller";
import { jwtMiddleware } from "../../middlewares/auth.middleware";

export const UserRoutes = new Hono();

// Aplicar JWT middleware a TODAS las rutas de user
UserRoutes.use("/*", jwtMiddleware);

// GET /user - Obtener todos los usuarios
UserRoutes.get("/", getAllUsersController);

// GET /user/:id - Obtener usuario por ID
UserRoutes.get("/:id", getUserByIdController);

// POST /user - Crear nuevo usuario
UserRoutes.post("/", createUserController);

// PUT /user/:id - Actualizar usuario
UserRoutes.put("/:id", updateUserController);

// DELETE /user/:id - Eliminar usuario
UserRoutes.delete("/:id", deleteUserController);