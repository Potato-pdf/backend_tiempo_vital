import { OfficeInterface } from "../../../types/office/office.interface";

export interface OfficeQueryInterface {
    findAll(): Promise<OfficeInterface[]>;
    findById(id: string): Promise<OfficeInterface | null>;
    findByName(name: string): Promise<OfficeInterface | null>;
}
