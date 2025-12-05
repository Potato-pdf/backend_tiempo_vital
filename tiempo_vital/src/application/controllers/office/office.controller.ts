import { Context } from "hono";
import { OfficeService } from "../../services/office/office.service";
import { OfficeQuery } from "../../../infrestructure/CQRS/office/office.query.cqrs";
import { OfficeCQRS } from "../../../infrestructure/CQRS/office/office.writting.cqrs";
import { OfficeDAO } from "../../../infrestructure/DAO/offices/office.dao";

// Inicializar dependencias
const officeDao = new OfficeDAO();
const officeQuery = new OfficeQuery(officeDao);
const officeCommand = new OfficeCQRS(officeDao);
const officeService = new OfficeService(officeQuery, officeCommand);

/**
 * Obtener todas las oficinas
 * GET /office
 */
export const getAllOfficesController = async (c: Context) => {
    try {
        const offices = await officeService.getAllOffices();

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

        const office = await officeService.getOfficeById(id);

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

        // Validación básica
        if (!name || !address || !city || !state || !zipCode || !userId) {
            return c.json({
                success: false,
                message: "Todos los campos son requeridos: name, address, city, state, zipCode, userId"
            }, 400);
        }

        // Verificar si la oficina ya existe por nombre
        const existingOffice = await officeService.getOfficeByName(name);
        if (existingOffice) {
            return c.json({
                success: false,
                message: "Ya existe una oficina con ese nombre"
            }, 409);
        }

        const newOffice = {
            id: crypto.randomUUID(),
            name,
            address,
            city,
            state,
            zipCode,
            userId,
            image: body.image
        };

        const createdOffice = await officeService.createOffice(newOffice);

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

        if (!id) {
            return c.json({
                success: false,
                message: "ID es requerido"
            }, 400);
        }

        // Verificar si la oficina existe
        const existingOffice = await officeService.getOfficeById(id);
        if (!existingOffice) {
            return c.json({
                success: false,
                message: "Oficina no encontrada"
            }, 404);
        }

        // Actualizar oficina
        const updatedOffice = await officeService.updateOffice(id, {
            ...existingOffice,
            ...body,
            id // Asegurar que no se cambie el ID
        });

        return c.json({
            success: true,
            message: "Oficina actualizada exitosamente",
            data: updatedOffice
        }, 200);

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

        if (!id) {
            return c.json({
                success: false,
                message: "ID es requerido"
            }, 400);
        }

        // Verificar si la oficina existe
        const existingOffice = await officeService.getOfficeById(id);
        if (!existingOffice) {
            return c.json({
                success: false,
                message: "Oficina no encontrada"
            }, 404);
        }

        await officeService.deleteOffice(id);

        return c.json({
            success: true,
            message: "Oficina eliminada exitosamente"
        }, 200);

    } catch (error) {
        console.error("Error eliminando oficina:", error);
        return c.json({
            success: false,
            message: "Error al eliminar oficina"
        }, 500);
    }
};
