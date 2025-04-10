# ⚖️ Themis Legal Assistant

Este proyecto utiliza tecnologías modernas para crear una aplicación legal completa y gratuita. La aplicación está diseñada para abogados o estudios jurídicos, facilitando la gestión integral de procesos, documentos, clientes y más.

---

---

## ⚙️ Funcionalidades principales de Themis Legal Assistant 

La aplicación busca brindar una solución integral para el trabajo jurídico, especialmente en el ámbito del litigio, con funcionalidades orientadas a estudios jurídicos, abogados independientes y equipos legales.

### 🗂️ Administración de procesos judiciales
- Alta, edición y baja de expedientes.
- Asignación de número de causa, carátula, juzgado, etc.

### 🧾 Actualización de estados del proceso
- Registro del estado procesal actual.
- Histórico de movimientos.

### 👥 Asignación de abogados, clientes, contrarios y terceros
- Relación entre personas físicas/jurídicas y los procesos.
- Posibilidad de múltiples partes por expediente.

### ⏳ Seguimiento de movimientos e impulso procesal
- Registro de resoluciones, presentaciones y traslados.
- Alertas para vencimientos procesales.

### 🧪 Mapa de pruebas
- Registro de pruebas ofrecidas, admitidas y producidas.
- Seguimiento del estado probatorio.

### 📝 Creación automática de escritos
- Formularios para generar escritos base (PDF o Word).
- Edición previa a descarga o envío.

### ✉️ Generación de telegramas y cartas documento
- Integración con plantillas y sistemas externos.

### 📅 Agenda jurídica
- Calendario de tareas, audiencias, vencimientos y compromisos.
- Notificaciones y recordatorios.

### 💰 Registro de ingresos y egresos
- Control financiero asociado a causas o clientes.
- Seguimiento de pagos, cobros y depósitos judiciales.

### 🧑‍💼 Gestión de personas
- Base de datos de clientes, contrarios, abogados y terceros.
- Información de contacto y relaciones por expediente.

### 📄 Emisión e impresión de listados
- Reportes personalizables (causas activas, vencimientos, etc.).

### 🔐 Gestión de usuarios y personal autorizado
- Alta, baja y edición de usuarios del sistema.
- Roles y permisos diferenciados.


## 🚀 Stack de tecnologías utilizadas

| Recurso                 | Herramientas elegidas             | Notas                                      |
|-------------------------|-----------------------------------|--------------------------------------------|
| **Frontend**            | Next.js + Tailwind CSS            | App Router activado                        |
| **Deploy**              | Netlify                           | Incluye Netlify Functions                  |
| **Backend API**         | Netlify Functions                 | Node.js (serverless)                       |
| **Base de datos**       | MongoDB Atlas + Mongoose          | NoSQL gratuito (512MB)                     |
| **Autenticación**       | Firebase Auth o Supabase Auth     | Planes gratuitos recomendados              |
| **Archivos**            | Cloudinary                        | Almacenamiento multimedia                  |

---

## 📂 Estructura del proyecto

themis-legal-assistant/ ├── netlify/ │ └── functions/ → Backend (serverless) │ ├── auth.ts → Autenticación │ └── db.ts → Conexión a MongoDB Atlas │ ├── public/ → Archivos estáticos │ ├── src/ → Código fuente │ ├── app/ → Next.js App Router (páginas) │ ├── components/ → Componentes UI reutilizables │ ├── lib/ → Configuración Firebase, Mongoose │ ├── styles/ → Estilos Tailwind y CSS │ └── utils/ → Funciones auxiliares │ ├── .gitignore ├── eslint.config.mjs ├── next-env.d.ts ├── next.config.ts ├── package.json ├── package-lock.json ├── postcss.config.mjs ├── README.md └── tsconfig.json

yaml
Copy
Edit

---

## ✅ Estado inicial del proyecto

| Elemento             | Estado     | Comentario                                        |
|----------------------|------------|---------------------------------------------------|
| 📁 **Carpetas**      | ✅ Correctas | Scaffolding inicial confirmado                   |
| 📌 **Alias @/**      | ✅ Activo   | Configurado en `tsconfig.json`                   |
| ⚡ **Netlify Functions** | ✅ Activas | Archivos iniciales creados (`auth.ts`, `db.ts`) |
| 📘 **TypeScript**    | ✅ Activado | Tipado estricto (`.ts`, `.tsx`)                   |
| 🧹 **ESLint**        | ✅ Activado | Código limpio y consistente                      |
| 🧭 **App Router**    | ✅ Activo   | Moderno, recomendado por Next.js                 |
| 💨 **Tailwind**      | ✅ Activo   | Configuración inicial lista                      |

---

## 🚩 Instalación y configuración inicial (PowerShell)

Ejecutá estos comandos después de clonar el repositorio para instalar dependencias esenciales:

```powershell
npm install
npm install mongoose firebase cloudinary
Para ejecutar el servidor de desarrollo localmente:

powershell
Copy
Edit
npm run dev
🧑‍💻 Decisiones tomadas en la instalación
Durante la configuración inicial con create-next-app, se seleccionaron las siguientes opciones:

Pregunta del instalador	Respuesta	Implicancias
✔️ ¿Usar TypeScript?	Sí	Archivos .ts y .tsx, tipado estricto
✔️ ¿Usar ESLint?	Sí	Configuración ESLint (eslint.config.mjs)
✔️ ¿Usar Tailwind CSS?	Sí	Tailwind configurado con PostCSS
✔️ ¿Colocar el código dentro de src/?	Sí	Código encapsulado en la carpeta src/
✔️ ¿Usar App Router (recomendado)?	Sí	Uso de App Router (src/app)
❌ ¿Usar Turbopack para next dev?	No	Bundler predeterminado (Webpack estable)
✔️ ¿Personalizar el alias de importación (@/*)?	Sí	Alias @/* para imports cortos desde src/
📌 Recomendaciones de sintaxis y buenas prácticas
1. Imports usando alias
Usar siempre el alias @ para rutas relativas dentro de src:

tsx
Copy
Edit
import MiComponente from "@/components/MiComponente";
2. Tipado estricto (TypeScript)
Priorizar interfaces claras y tipado explícito:

tsx
Copy
Edit
interface Proceso {
  id: string;
  titulo: string;
  descripcion: string;
}

const miProceso: Proceso = { id: '123', titulo: 'Mi Título', descripcion: '...' };
3. Componentes con Tailwind
Mantener clases de Tailwind organizadas:

tsx
Copy
Edit
export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
      Click aquí
    </button>
  );
}
4. Netlify Functions
Seguir estructura básica para funciones serverless (Netlify):

typescript
Copy
Edit
// netlify/functions/db.ts
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Éxito!" }),
  };
};
📄 Variables de entorno necesarias
Asegurate de configurar estas variables en Netlify para producción:

env
Copy
Edit
MONGODB_URI=tu_uri_mongodb_atlas
FIREBASE_API_KEY=tu_firebase_api_key
FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
CLOUDINARY_URL=tu_cloudinary_url
🚨 Notas adicionales
Autenticación: Podés elegir Firebase Auth o Supabase Auth, ambos son compatibles.

Documentación oficial recomendada:

Next.js

Tailwind CSS

Netlify Functions

Mongoose

Firebase Auth

Supabase

Cloudinary

🚧 Próximos pasos recomendados
 Implementar conexión inicial a MongoDB Atlas.

 Configurar autenticación Firebase/Supabase.

 Crear ejemplos base para funciones Netlify.

 Crear componentes UI iniciales con Tailwind.

