import { OfficeInterface } from "../../../domain/types/office/office.interface";
import { OfficeQueryInterface } from "../../../domain/repositories/offices/CQRS/office.query.interface";
import { OfficeInterfaceCqrs } from "../../../domain/repositories/offices/CQRS/office.interface.cqrs";

/**
 * Servicio de aplicación que orquesta las operaciones de Office usando CQRS
 */
export class OfficeService {
    private officeQuery: OfficeQueryInterface;
    private officeCommand: OfficeInterfaceCqrs;

    constructor(officeQuery: OfficeQueryInterface, officeCommand: OfficeInterfaceCqrs) {
        this.officeQuery = officeQuery;
        this.officeCommand = officeCommand;
    }

    // ============ QUERIES (Lectura) ============
    async getAllOffices(): Promise<OfficeInterface[]> {
        return this.officeQuery.findAll();
    }

    async getOfficeById(id: string): Promise<OfficeInterface | null> {
        return this.officeQuery.findById(id);
    }

    async getOfficeByName(name: string): Promise<OfficeInterface | null> {
        return this.officeQuery.findByName(name);
    }

    // ============ COMMANDS (Escritura) ============
    async createOffice(office: OfficeInterface): Promise<OfficeInterface> {
        return this.officeCommand.create(office);
    }

    async updateOffice(id: string, office: OfficeInterface): Promise<OfficeInterface> {
        return this.officeCommand.update(id, office);
    }

    async deleteOffice(id: string): Promise<void> {
        return this.officeCommand.delete(id);
    }
}
