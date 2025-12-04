import { UserInterface } from "../../../domain/types/user/user.interface";
import { UserQueryInterface } from "../../../domain/repositories/users/CQRS/user.query.interface";
import { UserInterfaceCqrs } from "../../../domain/repositories/users/CQRS/user.interface.cqrs";

/**
 * Servicio de aplicación que orquesta las operaciones de User usando CQRS
 */
export class UserService {
    private userQuery: UserQueryInterface;
    private userCommand: UserInterfaceCqrs;

    constructor(userQuery: UserQueryInterface, userCommand: UserInterfaceCqrs) {
        this.userQuery = userQuery;
        this.userCommand = userCommand;
    }

    // ============ QUERIES (Lectura) ============
    async getAllUsers(): Promise<UserInterface[]> {
        return this.userQuery.findAll();
    }

    async getUserById(id: string): Promise<UserInterface | null> {
        return this.userQuery.findById(id);
    }

    async getUserByEmail(email: string): Promise<UserInterface | null> {
        return this.userQuery.findByEmail(email);
    }

    // ============ COMMANDS (Escritura) ============
    async createUser(user: UserInterface): Promise<UserInterface> {
        return this.userCommand.create(user);
    }

    async updateUser(id: string, user: UserInterface): Promise<UserInterface> {
        return this.userCommand.update(id, user);
    }

    async deleteUser(id: string): Promise<void> {
        return this.userCommand.delete(id);
    }
}
