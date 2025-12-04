import { OfficeInterfaceDao } from "../../../domain/repositories/offices/DAO/office.interface.dao";
import { Office } from "../../../domain/models/office/office.model";
import { AppDataSource } from "../../db/database.connection";
import { Repository } from "typeorm";
import { OfficeInterface } from "../../../domain/types/office/office.interface";


export class OfficeDAO implements OfficeInterfaceDao {
    private officeRepository: Repository<Office>;

    constructor() {
        this.officeRepository = AppDataSource.getRepository(Office)
    }

    async findAll(): Promise<OfficeInterface[]> {
        const offices = await this.officeRepository.find();
        return offices as unknown as OfficeInterface[];
    }

    async findById(id: string): Promise<OfficeInterface | null> {
        const office = await this.officeRepository.findOneBy({ id });
        return office as unknown as OfficeInterface | null;
    }

    async findByName(name: string): Promise<OfficeInterface | null> {
        const office = await this.officeRepository.findOneBy({ name });
        return office as unknown as OfficeInterface | null;
    }

    async create(office: OfficeInterface): Promise<OfficeInterface> {
        const savedOffice = await this.officeRepository.save(office as any);
        return savedOffice as unknown as OfficeInterface;
    }

    async update(id: string, office: OfficeInterface): Promise<OfficeInterface> {
        const updatedOffice = await this.officeRepository.save({...office, id } as any);
        return updatedOffice as unknown as OfficeInterface;
    }

    async delete(id: string): Promise<void> {
        await this.officeRepository.delete(id);
    }
}