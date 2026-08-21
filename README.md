# Chambitas (OaxacaEmpleos) - Frontend

Plataforma web desarrollada en Angular para conectar a trabajadores de oficios locales (plomeros, pintores, electricistas, etc.) con clientes en Oaxaca. Permite la publicación de empleos, registro de perfiles profesionales y contacto directo.

---

## Características Principales

- Feed de Empleos: Visualización e interacción con publicaciones de trabajo activas.
- Directorio de Profesionales: Catálogo de trabajadores locales con opción de contacto rápido.
- Formularios Reactivos:
  - Registro y publicación de empleos (JobCreateForm).
  - Registro de prestadores de servicios (ProfessionalForm).
- Gestión de Estado Reactiva: Uso de Angular Signals para el manejo de estado local en memoria.
- Persistencia de Datos: Sincronización automática de publicaciones y perfiles con localStorage.
- Autenticación (Módulo Auth): Vistas para inicio de sesión (LoginComponent) y registro de usuarios (RegisterComponent).
- Diseño Adaptable: Interfaz moderna y responsive estilizada con Tailwind CSS.

---

## Tecnologías Utilizadas

- Framework: Angular (v21 standalone components)
- Lenguaje: TypeScript
- Estilos: Tailwind CSS
- Manejo de Estado: Angular Signals
- Enrutamiento: Angular Router
- Ejecución y Pruebas: Angular CLI & Vitest

---

## Estructura del Proyecto

```text
src/
├── app/
│   ├── features/
│   │   └── jobs/
│   │       ├── components/
│   │       │   ├── job-create-form/      # Formulario para publicar empleos
│   │       │   ├── job-feed/             # Listado principal de ofertas de trabajo
│   │       │   ├── professional-feed/    # Directorio de trabajadores
│   │       │   └── professional-form/    # Formulario para registrar oficios
│   │       └── services/
│   │           └── job.service.ts        # Lógica de negocio y persistencia en localStorage
│   ├── pages/
│   │   └── auth/                         # Vistas de Login y Registro
│   ├── app.component.ts
│   └── app.routes.ts                     # Configuración central de rutas