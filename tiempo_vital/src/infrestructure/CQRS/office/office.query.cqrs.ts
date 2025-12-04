import { OfficeQueryInterface } from "../../../domain/repositories/offices/CQRS/office.query.interface";
import { OfficeInterfaceDao } from "../../../domain/repositories/offices/DAO/office.interface.dao";
import { OfficeInterface } from "../../../domain/types/office/office.interface";

export class OfficeQuery implements OfficeQueryInterface {
    private officeDao: OfficeInterfaceDao;

    constructor(officeDao: OfficeInterfaceDao) {
        this.officeDao = officeDao;
    }

    async findAll(): Promise<OfficeInterface[]> {
        return this.officeDao.findAll();
    }

    async findById(id: string): Promise<OfficeInterface | null> {
        return this.officeDao.findById(id);
    }

    async findByName(name: string): Promise<OfficeInterface | null> {
        return this.officeDao.findByName(name);
    }
}
