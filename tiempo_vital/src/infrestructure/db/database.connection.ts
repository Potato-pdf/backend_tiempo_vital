import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 11432,
    username: "user",
    password: "password",
    database: "hono_db",
    synchronize: true,
    logging: false,
    entities: [],
});