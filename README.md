# LA SEDE APP

Aplicacion web de gestion de cuotas y actividades para la sede de un club, desarrollada con arquitectura Full Stack. El frontend esta construido con React y Vite, mientras que el backend utiliza Node.js, Express y Sequelize con base de datos MySQL. Permite a los socios gestionar sus cuotas, reservar canchas, inscribirse en clases, comprar entradas y administrar sus actividades, ademas de proporcionar un panel de administracion completo.

![La Sede App](https://res.cloudinary.com/dsbjzd18p/image/upload/v1763340698/la-sede-app_s7qwmx.png)

## Tabla de Contenidos

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion y Configuracion](#instalacion-y-configuracion)
- [Arquitectura y DiseÃ±o](#arquitectura-y-diseno)
- [API Endpoints](#api-endpoints)
- [Contextos y Gestion de Estado](#contextos-y-gestion-de-estado)
- [Funcionalidades](#funcionalidades)

## Tecnologias Utilizadas

### Frontend

- **React 19**: Biblioteca principal para la construccion de la interfaz de usuario.
- **React Router DOM 7**: Sistema de enrutamiento.
- **Vite**: Herramienta de construccion y desarrollo.
- **Tailwind CSS 4**: Framework de CSS para estilos.
- **Lucide React**: Biblioteca de iconos.

### Backend

- **Node.js**: Entorno de ejecucion para el servidor.
- **Express**: Framework web para la API RESTful.
- **Sequelize**: ORM para interactuar con la base de datos MySQL.
- **MySQL**: Base de datos relacional para persistencia de datos.
- **JWT (JsonWebToken)**: Para autenticacion segura y manejo de sesiones.
- **Bcryptjs**: Hashing de contrasenas.
- **Multer & Cloudinary**: Middleware y servicio para subida y almacenamiento de imagenes en la nube.

## Estructura del Proyecto

El proyecto se divide en dos directorios principales dentro de la raiz `la-sede-app`:

- **backend/**: Contiene el servidor, modelos de datos, rutas de la API, controladores y configuracion de base de datos.
- **frontend/**: Contiene la aplicacion React, componentes, paginas y logica de cliente.

## Instalacion y Configuracion

### Requisitos Previos

- Node.js (versión 18 o superior)
- MySQL (o XAMPP/WAMP para servidor local de base de datos)
- Cuenta en Cloudinary (para subida de imagenes)

### Configuracion del Backend

1. Navegar al directorio del backend:
   ```bash
   cd la-sede-app/backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` basado en `.env.example` y configurar las variables:
   - `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`: Credenciales de MySQL.
   - `JWT_SECRET`: Clave secreta para tokens.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credenciales de Cloudinary.

4. Iniciar el servidor (esto tambien sincronizara las tablas de la base de datos):
   ```bash
   npm start
   ```
   El servidor correra en `http://localhost:3000`.

### Configuracion del Frontend

1. Navegar al directorio del frontend:
   ```bash
   cd la-sede-app/frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicacion estara disponible en `http://localhost:5173`.

## Arquitectura y Diseno

La aplicacion sigue una arquitectura cliente-servidor (Full Stack).

- **Frontend**: Consume la API REST expuesta por el backend. Maneja el estado global mediante React Context (`AuthContext` y `DataContext`).
- **Backend**: Expone endpoints REST protegidos por middleware de autenticacion JWT. Utiliza Sequelize para modelar datos y relaciones (Usuario, Reserva, Cancha, etc.).

## API Endpoints

### Autenticacion
- `POST /api/auth/login`: Iniciar sesion y obtener token.
- `POST /api/auth/register`: Registrar nuevo usuario.

### Usuarios
- `GET /api/usuarios`: Listar usuarios (Admin).
- `PUT /api/usuarios/:id`: Actualizar perfil de usuario (incluyendo foto).
- `POST /api/upload`: Subir imagen de perfil a Cloudinary.
- `POST /api/pagos`: Registrar pago de cuota.

### Recursos
- `GET /api/canchas`: Listar canchas.
- `POST /api/reservas`: Crear reserva de cancha (valida solapamientos).
- `GET /api/clases`: Listar clases.
- `POST /api/clases/:id/inscribir`: Inscripcion a clase.
- `POST /api/entradas`: Compra de entradas a partidos (control de stock).

## Contextos y Gestion de Estado

### AuthContext
Gestiona el token JWT y la informacion del usuario logueado. Persiste la sesion en `localStorage`.

### DataContext
Centraliza las peticiones a la API. Al cargar, realiza un fetch inicial (`/api/init`) para poblar el estado de la aplicacion (usuarios, canchas, reservas, etc.) desde la base de datos real.

## Funcionalidades

### Autenticacion
- Login seguro con JWT.
- Roles de usuario: 'user' y 'admin'.
- Proteccion de rutas privadas en el frontend.

### Gestion de Perfil
- Edicion de datos personales.
- **Subida de Foto de Perfil**: Integracion real con Cloudinary.

### Gestion de Cuotas
- Visualizacion del estado de cuota (Paga/Pendiente).
- Registro de pagos persistente en base de datos.

### Reserva de Canchas
- Validacion de horarios disponibles en tiempo real.
- Bloqueo visual de horarios ocupados en el selector.
- Persistencia de reservas en MySQL.

### Inscripciones y Entradas
- Control de cupos para clases.
- Control de stock para entradas de partidos.

### Panel de Administracion
- Dashboard con metricas.
- Gestion de usuarios y recursos del club.
