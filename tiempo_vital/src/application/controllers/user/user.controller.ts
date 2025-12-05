import { Context } from "hono";
import { UserService } from "../../services/user/user.service";
import { UserQuery } from "../../../infrestructure/CQRS/users/user.query.cqrs";
import { UserCQRS } from "../../../infrestructure/CQRS/users/user.writting.cqrs";
import { UserDAO } from "../../../infrestructure/DAO/users/user.dao";

// Inicializar dependencias
const userDao = new UserDAO();
const userQuery = new UserQuery(userDao);
const userCommand = new UserCQRS(userDao);
const userService = new UserService(userQuery, userCommand);

/**
 * Obtener todos los usuarios
 * GET /user
 */
export const getAllUsersController = async (c: Context) => {
    try {
        const users = await userService.getAllUsers();

        // No retornar contraseñas
        const sanitizedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            rol: user.rol,
            office: user.office
        }));

        return c.json({
            success: true,
            data: sanitizedUsers
        }, 200);

    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        return c.json({
            success: false,
            message: "Error al obtener usuarios"
        }, 500);
    }
};

/**
 * Obtener usuario por ID
 * GET /user/:id
 */
export const getUserByIdController = async (c: Context) => {
    try {
        const id = c.req.param("id");

        if (!id) {
            return c.json({
                success: false,
                message: "ID es requerido"
            }, 400);
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return c.json({
                success: false,
                message: "Usuario no encontrado"
            }, 404);
        }

        // No retornar contraseña
        const sanitizedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            rol: user.rol,
            office: user.office
        };

        return c.json({
            success: true,
            data: sanitizedUser
        }, 200);

    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        return c.json({
            success: false,
            message: "Error al obtener usuario"
        }, 500);
    }
};

/**
 * Crear nuevo usuario
 * POST /user
 */
export const createUserController = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { name, email, password, rol, office } = body;

        // Validación básica
        if (!name || !email || !password || !rol) {
            return c.json({
                success: false,
                message: "Campos requeridos: name, email, password, rol"
            }, 400);
        }

        // Verificar si el email ya existe
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return c.json({
                success: false,
                message: "El email ya está registrado"
            }, 409);
        }

        // Crear usuario (el password se hashea en UserCQRS)
        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password,
            rol,
            office: office || [],
            image: body.image
        };

        const createdUser = await userService.createUser(newUser);

        // No retornar contraseña
        const sanitizedUser = {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            rol: createdUser.rol,
            office: createdUser.office
        };

        return c.json({
            success: true,
            message: "Usuario creado exitosamente",
            data: sanitizedUser
        }, 201);

    } catch (error) {
        console.error("Error creando usuario:", error);
        return c.json({
            success: false,
            message: error instanceof Error ? error.message : "Error al crear usuario"
        }, 500);
    }
};

/**
 * Actualizar usuario
 * PUT /user/:id
 */
export const updateUserController = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();

        if (!id) {
            return c.json({
                success: false,
                message: "ID es requerido"
            }, 400);
        }

        // Verificar si el usuario existe
        const existingUser = await userService.getUserById(id);
        if (!existingUser) {
            return c.json({
                success: false,
                message: "Usuario no encontrado"
            }, 404);
        }

        // Si se actualiza la contraseña, hashearla
        if (body.password) {
            body.password = await Bun.password.hash(body.password);
        }

        // Actualizar usuario
        const updatedUser = await userService.updateUser(id, {
            ...existingUser,
            ...body,
            id // Asegurar que no se cambie el ID
        });

        // No retornar contraseña
        const sanitizedUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            rol: updatedUser.rol,
            office: updatedUser.office,
            image: updatedUser.image
        };

        return c.json({
            success: true,
            message: "Usuario actualizado exitosamente",
            data: sanitizedUser
        }, 200);

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return c.json({
            success: false,
            message: "Error al actualizar usuario"
        }, 500);
    }
};

/**
 * Eliminar usuario
 * DELETE /user/:id
 */
export const deleteUserController = async (c: Context) => {
    try {
        const id = c.req.param("id");

        if (!id) {
            return c.json({
                success: false,
                message: "ID es requerido"
            }, 400);
        }

        // Verificar si el usuario existe
        const existingUser = await userService.getUserById(id);
        if (!existingUser) {
            return c.json({
                success: false,
                message: "Usuario no encontrado"
            }, 404);
        }

        await userService.deleteUser(id);

        return c.json({
            success: true,
            message: "Usuario eliminado exitosamente"
        }, 200);

    } catch (error) {
        console.error("Error eliminando usuario:", error);
        return c.json({
            success: false,
            message: "Error al eliminar usuario"
        }, 500);
    }
};
