export interface AuthRepository{
    findByEmail(email: string): Promise<any>;
    passwordVerify(password: any) : Promise<any>;
}
