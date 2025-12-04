# Backend Tiempo Vital 🚀

API REST desarrollada con **Bun**, **Hono**, **TypeORM** y **PostgreSQL** usando arquitectura limpia y patrón CQRS.

## 🏗️ Arquitectura

```
src/
├── application/          # Capa de aplicación
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Servicios de aplicación (orquestación)
│   ├── routes/          # Definición de rutas
│   └── middlewares/     # Middlewares (JWT, etc.)
├── domain/              # Capa de dominio
│   ├── models/         # Entidades TypeORM
│   ├── types/          # Interfaces de dominio
│   └── repositories/   # Contratos de repositorios
└── infrastructure/      # Capa de infraestructura
    ├── DAO/            # Data Access Objects (lectura)
    ├── CQRS/           # Comandos y Queries (CQRS)
    ├── services/       # Servicios de infraestructura
    └── db/             # Conexión a base de datos
```

## 🚀 Instalación

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
bun run dev
```

## 📡 API Endpoints

### 🔐 Autenticación (`/auth`)

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "admin",
  "office": []
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### 👤 Usuarios (`/user`) 🔒 *Requiere JWT*

- `GET /user` - Obtener todos los usuarios
- `GET /user/:id` - Obtener usuario por ID
- `POST /user` - Crear usuario
- `PUT /user/:id` - Actualizar usuario
- `DELETE /user/:id` - Eliminar usuario

### 🏢 Oficinas (`/office`) 🔒 *Requiere JWT*

- `GET /office` - Obtener todas las oficinas
- `GET /office/:id` - Obtener oficina por ID
- `POST /office` - Crear oficina
- `PUT /office/:id` - Actualizar oficina
- `DELETE /office/:id` - Eliminar oficina

## 🔑 Autenticación JWT

Todas las rutas excepto `/auth/login` y `/auth/register` requieren autenticación JWT.

### Usar el token:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token expira en **24 horas**.

## 🎯 Patrones de Diseño Utilizados

- ✅ **Clean Architecture** - Separación en capas
- ✅ **CQRS** - Separación de lectura y escritura
- ✅ **Repository Pattern** - Abstracción de persistencia
- ✅ **Dependency Injection** - Inyección de dependencias
- ✅ **DTO Pattern** - Data Transfer Objects

## 📦 Tecnologías

- **Runtime**: Bun
- **Framework**: Hono
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (Hono JWT)
- **Lenguaje**: TypeScript
