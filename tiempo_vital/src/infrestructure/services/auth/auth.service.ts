import { AuthRepository } from "../../../domain/repositories/auth/auth.repository";
import { UserInterface } from "../../../domain/types/user/user.interface";
import { LoginResponse } from "../../../domain/types/auth/auth.interface";
import { UsersInterfaceDao } from "../../../domain/repositories/users/DAO/users.interface.dao";
import { sign } from "hono/jwt";

export class AuthService implements AuthRepository {
    private userDao: UsersInterfaceDao;
    private jwtSecret: string;

    constructor(userDao: UsersInterfaceDao, jwtSecret: string = "your-secret-key-change-this") {
        this.userDao = userDao;
        this.jwtSecret = jwtSecret;
    }

    async findByEmail(email: string): Promise<UserInterface | null> {
        return this.userDao.findByEmail(email);
    }

    async passwordVerify(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await Bun.password.verify(plainPassword, hashedPassword);
    }

    async createToken(userId: string, email: string, rol: string): Promise<string> {
        const payload = {
            userId,
            email,
            rol,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 horas
        };

        return await sign(payload, this.jwtSecret);
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            // Buscar usuario por email
            const user = await this.findByEmail(email);

            if (!user) {
                return {
                    success: false,
                    message: "Usuario no encontrado"
                };
            }

            // Verificar contraseña
            const isValidPassword = await this.passwordVerify(password, user.password);

            if (!isValidPassword) {
                return {
                    success: false,
                    message: "Contraseña incorrecta"
                };
            }

            // Crear token JWT
            const token = await this.createToken(user.id, user.email, user.rol);

            // Retornar respuesta exitosa (sin contraseña)
            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    rol: user.rol
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "Error en el login"
            };
        }
    }
}
