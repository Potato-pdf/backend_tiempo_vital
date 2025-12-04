import { OfficeInterfaceCqrs } from "../../../domain/repositories/offices/CQRS/office.interface.cqrs";
import { OfficeInterfaceDao } from "../../../domain/repositories/offices/DAO/office.interface.dao";
import { OfficeInterface } from "../../../domain/types/office/office.interface";
import { randomUUID } from "crypto";

export class OfficeCQRS implements OfficeInterfaceCqrs {
    private officeDao: OfficeInterfaceDao;
    constructor(officeDao: OfficeInterfaceDao) {
        this.officeDao = officeDao;
    }
    async create(office: OfficeInterface): Promise<OfficeInterface> {
        if (!office.name || !office.address || !office.city || !office.state || !office.zipCode || !office.userId) {
            throw new Error("Invalid office data");
        }
        office.id = randomUUID();
        return this.officeDao.create(office);
    }
    async update(id: string, office: OfficeInterface): Promise<OfficeInterface> {
        office.id = id;
        return this.officeDao.update(id, office);
    }
    async delete(id: string): Promise<void> {
        return this.officeDao.delete(id);
    }
}