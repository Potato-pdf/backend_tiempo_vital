import { OfficeInterface } from "../../../types/office/office.interface";


export interface OfficeInterfaceCqrs {
    findAll(): Promise<OfficeInterface[]>
    findById(id: string): Promise<OfficeInterface | null>
    findByName(name: string): Promise<OfficeInterface | null>
    create(office: OfficeInterface): Promise<OfficeInterface>
    update(id: string, office: OfficeInterface): Promise<OfficeInterface>
    delete(id: string): Promise<void>
}   