import { OfficeInterface } from "../../../types/office/office.interface";


export interface OfficeInterfaceCqrs {
    create(office: OfficeInterface): Promise<OfficeInterface>
    update(id: string, office: OfficeInterface): Promise<OfficeInterface>
    delete(id: string): Promise<void>
}   