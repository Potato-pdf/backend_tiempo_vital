import { Hono } from "hono";
import {
    getAllOfficesController,
    getOfficeByIdController,
    createOfficeController,
    updateOfficeController,
    deleteOfficeController
} from "../../controllers/office/office.controller";
import { jwtMiddleware } from "../../middlewares/auth.middleware";

export const OfficeRoutes = new Hono();

// Aplicar JWT middleware a TODAS las rutas de office
OfficeRoutes.use("/*", jwtMiddleware);

// GET /office - Obtener todas las oficinas
OfficeRoutes.get("/", getAllOfficesController);

// GET /office/:id - Obtener oficina por ID
OfficeRoutes.get("/:id", getOfficeByIdController);

// POST /office - Crear nueva oficina
OfficeRoutes.post("/", createOfficeController);

// PUT /office/:id - Actualizar oficina
OfficeRoutes.put("/:id", updateOfficeController);

// DELETE /office/:id - Eliminar oficina
OfficeRoutes.delete("/:id", deleteOfficeController);
