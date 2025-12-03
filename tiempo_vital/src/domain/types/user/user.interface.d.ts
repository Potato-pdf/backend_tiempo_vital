import { OfficeInterface } from "../office/office.interface";

export interface UserInterface {
    name: string;
    email: string;
    password: string;
    rol: string;
    office: OfficeInterface[];
}
