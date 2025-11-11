export interface AuthRepository{
    findByEmail(email: string): Promise<any>;
    passwordVerify(password: any) : Promise<any>;
    createToken(user:any): Promise<any>;
}
