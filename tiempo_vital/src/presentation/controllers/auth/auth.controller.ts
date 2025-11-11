import { User } from "../../../domain/models/users/user.model";
import { AppDataSource } from "../../../infrestructure/db/database.connection";
import { TypeORMAuthRepository } from "../../../infrestructure/repositories/auth/auth.repository";

const AuthRepository = new TypeORMAuthRepository(AppDataSource.getRepository(User));
const createLoginUseCase = new CreateLoginUseCase(AuthRepository)