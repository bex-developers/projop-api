# Projop-API

Project Open REST API (Node.js + Express + PostgreSQL)

## Descripción
API modularizada para la gestión de tickets, proyectos, compañías, categorías y configuration items, basada en Node.js, Express y PostgreSQL. 

## Estructura del Proyecto

```
projop-api/
├── deploy-api.sh
├── Dockerfile
├── keycloak.json
├── LICENSE
├── package.json
├── README.md
├── src/
│   ├── app.js                # Configuración principal de la app Express
│   ├── server.js             # Arranque del servidor
│   ├── config/
│   │   ├── config.js         # Variables de entorno y configuración
│   │   └── db.js             # Conexión centralizada a PostgreSQL
│   ├── controllers/
│   │   ├── tickets.controller.js
│   │   ├── projects.controller.js
│   │   ├── company.controller.js
│   │   ├── categories.controller.js
│   │   └── conf_items.controller.js
│   └── routes/
│       ├── tickets.routes.js
│       ├── projects.routes.js
│       ├── company.routes.js
│       ├── categories.routes.js
│       └── conf_items.routes.js
```

## Instalación

1. Clona el repositorio:
   ```sh
   git clone <repo_url>
   cd projop-api
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Configura las variables de entorno en `src/config/config.js` o usando `.env`.
4. Asegúrate de tener una base de datos PostgreSQL accesible y configurada.

## Uso

- Antes de levantar el servidor, asegúrate de definir el entorno:
  ```powershell
  $env:NODE_ENV='development'
  ```
  O usa la variable de entorno correspondiente según tu sistema operativo.

- Levanta el servidor:
  ```sh
  npm start
  # o
  node src/server.js
  ```
- El servidor escuchará en el puerto definido en la variable de entorno `PORT` (por defecto 8081).

## Endpoints principales

- `/tickets/status_ticket` — Lista de estados de ticket
- `/tickets/:company_id/:fecha_inicial/:fecha_final` — Tickets por compañía y fechas
- `/projects` — Proyectos
- `/company` — Compañías
- `/categories` — Categorías
- `/conf_items` — Configuration Items

Consulta los archivos de rutas en `src/routes/` para ver todos los endpoints disponibles.

## Testing

- Puedes usar herramientas como Postman, Insomnia o curl para probar los endpoints.

## Logging

- El proyecto utiliza `morgan` para logging HTTP en consola.

## Docker

- Puedes construir y correr el proyecto con Docker usando el `Dockerfile` y el script `deploy-api.sh`.

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature/fix
3. Haz tus cambios y abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
