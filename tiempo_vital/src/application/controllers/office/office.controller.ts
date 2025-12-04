import { Context } from "hono";
import { OfficeService } from "../../services/office/office.service";
import { OfficeQuery } from "../../../infrestructure/CQRS/office/office.query.cqrs";
import { OfficeCQRS } from "../../../infrestructure/CQRS/office/office.writting.cqrs";
import { OfficeDAO } from "../../../infrestructure/DAO/offices/office.dao";

// Inicializar dependencias
const officeDao = new OfficeDAO();
const officeQuery = new OfficeQuery(officeDao);
const officeCommand = new OfficeCQRS(officeDao);
// TODO: Crear OfficeService similar a UserService

/**
 * Obtener todas las oficinas
 * GET /office
 */
export const getAllOfficesController = async (c: Context) => {
    try {
        // TODO: Implementar usando officeService.getAllOffices()
        const offices = await officeQuery.findAll();

        return c.json({
            success: true,
            data: offices
        }, 200);

    } catch (error) {
        console.error("Error obteniendo oficinas:", error);
        return c.json({
            success: false,
            message: "Error al obtener oficinas"
        }, 500);
    }
};

/**
 * Obtener oficina por ID
 * GET /office/:id
 */
export const getOfficeByIdController = async (c: Context) => {
    try {
        const id = c.req.param("id");

        if (!id) {
            return c.json({
                success: false,
                message: "ID es requerido"
            }, 400);
        }

        // TODO: Implementar
        const office = await officeQuery.findById(id);

        if (!office) {
            return c.json({
                success: false,
                message: "Oficina no encontrada"
            }, 404);
        }

        return c.json({
            success: true,
            data: office
        }, 200);

    } catch (error) {
        console.error("Error obteniendo oficina:", error);
        return c.json({
            success: false,
            message: "Error al obtener oficina"
        }, 500);
    }
};

/**
 * Crear nueva oficina
 * POST /office
 */
export const createOfficeController = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { name, address, city, state, zipCode, userId } = body;

        // TODO: Validación completa
        if (!name || !address || !city || !state || !zipCode || !userId) {
            return c.json({
                success: false,
                message: "Todos los campos son requeridos"
            }, 400);
        }

        const newOffice = {
            id: crypto.randomUUID(),
            name,
            address,
            city,
            state,
            zipCode,
            userId
        };

        // TODO: Usar officeService.createOffice()
        const createdOffice = await officeCommand.create(newOffice);

        return c.json({
            success: true,
            message: "Oficina creada exitosamente",
            data: createdOffice
        }, 201);

    } catch (error) {
        console.error("Error creando oficina:", error);
        return c.json({
            success: false,
            message: error instanceof Error ? error.message : "Error al crear oficina"
        }, 500);
    }
};

/**
 * Actualizar oficina
 * PUT /office/:id
 */
export const updateOfficeController = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();

        // TODO: Implementar validación y actualización completa
        // Usar el patrón del updateUserController

        return c.json({
            success: true,
            message: "Implementar actualización de oficina"
        }, 501); // 501 = Not Implemented

    } catch (error) {
        console.error("Error actualizando oficina:", error);
        return c.json({
            success: false,
            message: "Error al actualizar oficina"
        }, 500);
    }
};

/**
 * Eliminar oficina
 * DELETE /office/:id
 */
export const deleteOfficeController = async (c: Context) => {
    try {
        const id = c.req.param("id");

        // TODO: Implementar validación y eliminación completa
        // Usar el patrón del deleteUserController

        return c.json({
            success: true,
            message: "Implementar eliminación de oficina"
        }, 501); // 501 = Not Implemented

    } catch (error) {
        console.error("Error eliminando oficina:", error);
        return c.json({
            success: false,
            message: "Error al eliminar oficina"
        }, 500);
    }
};
