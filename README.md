# Guía del Proyecto DevTree

Esta guía explica la estructura del proyecto y el propósito de cada archivo para ayudarte a entender mejor el código.

## Descripción General

Este es un proyecto **Full Stack** que combina un backend en Node.js con un frontend en React.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **`backend/`**: Contiene toda la lógica del servidor, base de datos y API (Node.js + Express).
- **`frontend/`**: Contiene la interfaz de usuario (React + Vite).

---

## 1. Backend (`/backend`)

Esta carpeta contiene la API que maneja los datos y la autenticación.

### Archivos de Configuración (`backend/`)

- **`package.json`**: Dependencias del servidor (`express`, `mongoose`, `bcrypt`, `express-validator`).
- **`.env`**: Variables de entorno (Database URL, puertos).
- **`tsconfig.json`**: Configuración de TypeScript para el servidor.

### Código Fuente (`backend/src/`)

Aquí es donde vive toda la lógica de tu aplicación.

#### Puntos de Entrada

- **`src/index.ts`**:

  - Es el punto de inicio de la aplicación.
  - Importa el `server` configurado.
  - Define el puerto (4000 o el que diga el sistema).
  - Pone el servidor a "escuchar" peticiones (`server.listen`).

- **`src/server.ts`**:

  - Configura la aplicación de Express (`app`).
  - **Conexión a DB**: Llama a `connectDB()` para conectarse a MongoDB.
  - **Middlewares**: Configura `express.json()` para que el servidor entienda datos en formato JSON.
  - **Rutas**: Define que todas las rutas empezarán desde la raíz `/` usando el `router`.

- **`src/router.ts`**:
  - Define las URLs (rutas) de tu API.
  - Actualmente tiene una ruta:
    - `POST /auth/register`: Importa `body` de `express-validator` para validar que los campos (como `handle`) no estén vacíos antes de procesar la petición.
    - Cuando alguien envía datos a esta dirección, primero pasa por la validación y luego se ejecuta la función `createAccount`.

#### Componentes (Carpetas)

- **`src/config/db.ts`**:

  - Se encarga exclusivamente de **conectar a la base de datos**.
  - Usa `mongoose.connect` con la variable de entorno `MONGO_URI`.
  - Si falla la conexión, detiene la aplicación para evitar errores mayores.

- **`src/models/User.ts`**:

  - Define el **Modelo de Datos** (Schema) para los Usuarios.
  - Especifica qué campos tiene un usuario en la base de datos:
    - `handle`: Nombre de usuario único (slug).
    - `name`: Nombre real.
    - `email`: Correo electrónico (único).
    - `password`: Contraseña.
  - TypeScript usa la interfaz `IUser` para saber qué tipos de datos esperar.

- **`src/handlers/index.ts`**:

  - Contiene los **Controladores** (la lógica de negocio).
  - **`createAccount`**:
    1. Validar resultados: Usa `validationResult` de `express-validator` para ver si hubo errores en la ruta (router). Si hay errores, devuelve un 400 y detiene la ejecución.
    2. Recibe los datos (`req.body`).
    3. Verifica si el email ya existe.
    4. Genera un `handle` (slug) y verifica si ya existe.
    5. Hashea (encripta) la contraseña.
    6. Guarda el nuevo usuario en la base de datos.
    7. Responde al cliente (éxito o error).

- **`utils/auth.ts`**:
  - Funciones de utilidad (`hashPassword`).

---

## 2. Frontend (`/frontend`)

Esta carpeta contiene la aplicación web construida con **React** y **Vite**.

### Archivos Clave (`frontend/`)

- **`vite.config.ts`**: Configuración del empaquetador Vite.
- **`index.html`**: El archivo HTML base donde se "monta" la aplicación de React.

### Código Fuente (`frontend/src/`)

- **`main.tsx`**:

  - Punto de entrada de React.
  - Renderiza el componente `<App />` dentro del `div#root` del HTML.
  - Importa los estilos globales (`index.css`).

- **`App.tsx`**:
  - Componente principal de la aplicación.
  - Aquí definirás la estructura base de tu interfaz o tus rutas.

---

## Flujo de Trabajo

### Desarrollo

1.  **Backend**: En una terminal dentro de `/backend`, corre `npm run dev` (Puerto 4000).
2.  **Frontend**: En otra terminal dentro de `/frontend`, corre `npm run dev` (Puerto 5173).

### Ejemplo: Flujo de Registro

1. **Cliente** (Frontend) envía `POST` a `http://localhost:4000/auth/register`.
2. **`index.ts`** (Backend) recibe la petición.
3. **`router.ts`** ejecuta las validaciones de `express-validator`.
4. Si pasa la validación, **`handlers/index.ts`** procesa el registro (guarda en DB).
5. Se envía respuesta de éxito al Frontend.
