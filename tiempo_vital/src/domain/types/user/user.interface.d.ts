export interface UserInterface {
    id?: string;
    name: string;
    email: string;
    password: string;
    rol: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    rol: string;
}
