export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        rol: string;
        image?: string;
    };
    message?: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    rol: string;
}