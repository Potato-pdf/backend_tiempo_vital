import { Context, Next } from "hono";
import { verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "tu-secret-jwt-aqui";

/**
 * Middleware para verificar el token JWT
 * Uso: app.use("/ruta-protegida", jwtMiddleware)
 */
export const jwtMiddleware = async (c: Context, next: Next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = c.req.header("Authorization");

        if (!authHeader) {
            return c.json({
                success: false,
                message: "Token no proporcionado"
            }, 401);
        }

        // Formato esperado: "Bearer <token>"
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        if (!token) {
            return c.json({
                success: false,
                message: "Token inválido"
            }, 401);
        }

        // Verificar el token
        const payload = await verify(token, JWT_SECRET);

        if (!payload) {
            return c.json({
                success: false,
                message: "Token inválido o expirado"
            }, 401);
        }

        // Guardar el payload en el contexto para usarlo en los controllers
        c.set("user", payload);

        // Continuar con la siguiente función
        await next();

    } catch (error) {
        console.error("Error en JWT middleware:", error);
        return c.json({
            success: false,
            message: "Token inválido o expirado"
        }, 401);
    }
};

/**
 * Middleware opcional para verificar roles específicos
 * Uso: app.use("/admin/*", requireRole("admin"))
 */
export const requireRole = (requiredRole: string) => {
    return async (c: Context, next: Next) => {
        const user = c.get("user");

        if (!user) {
            return c.json({
                success: false,
                message: "No autenticado"
            }, 401);
        }

        if (user.rol !== requiredRole) {
            return c.json({
                success: false,
                message: "No tienes permisos para acceder a este recurso"
            }, 403);
        }

        await next();
    };
};
