import { Context } from "hono";
import { AuthService } from "../../../infrestructure/services/auth/auth.service";
import { UserDAO } from "../../../infrestructure/DAO/users/user.dao";

// Instancia del servicio de autenticación
const userDao = new UserDAO();
const authService = new AuthService(userDao, process.env.JWT_SECRET || "tu-secret-jwt-aqui");

/**
 * Controller para login de usuarios
 * POST /auth/login
 */
export const loginController = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;

        // Validar que vengan los campos requeridos
        if (!email || !password) {
            return c.json({
                success: false,
                message: "Email y contraseña son requeridos"
            }, 400);
        }

        // Llamar al servicio de autenticación
        const loginResult = await authService.login(email, password);

        // Retornar respuesta según resultado
        if (loginResult.success) {
            return c.json(loginResult, 200);
        } else {
            return c.json(loginResult, 401);
        }

    } catch (error) {
        console.error("Error en login:", error);
        return c.json({
            success: false,
            message: "Error interno del servidor"
        }, 500);
    }
};

/**
 * Controller para registro de usuarios
 * POST /auth/register
 * (Este puede reutilizar el createUser del UserController)
 */
export const registerController = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { name, email, password, rol, office } = body;

        // Validar campos requeridos
        if (!name || !email || !password || !rol) {
            return c.json({
                success: false,
                message: "Todos los campos son requeridos: name, email, password, rol"
            }, 400);
        }

        // Verificar si el usuario ya existe
        const existingUser = await authService.findByEmail(email);
        if (existingUser) {
            return c.json({
                success: false,
                message: "El usuario ya existe"
            }, 409);
        }

        // Hash de contraseña
        const hashedPassword = await Bun.password.hash(password);

        // Crear objeto de usuario
        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            rol,
            office: office || [],
            image: body.image
        };

        // Aquí deberías usar el UserService/UserCQRS para crear el usuario
        // Por simplicidad, usamos directamente el DAO
        const createdUser = await userDao.create(newUser);

        // Crear token para el nuevo usuario
        const token = await authService.createToken(createdUser.id, createdUser.email, createdUser.rol);

        return c.json({
            success: true,
            message: "Usuario registrado exitosamente",
            token,
            user: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                rol: createdUser.rol,
                image: createdUser.image
            }
        }, 201);

    } catch (error) {
        console.error("Error en registro:", error);
        return c.json({
            success: false,
            message: "Error al registrar usuario"
        }, 500);
    }
};
