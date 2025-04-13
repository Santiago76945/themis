themis-legal-assistant/
├── .netlify/                      # (Netlify-specific build/config directory)
│   └── functions/
│       ├── auth.ts               # Lógica de autenticación (login/register con DB)
│       ├── createUserProfile.ts  # Crea y guarda perfil de usuario
│       ├── db.ts                 # Conexión a MongoDB y lógica de persistencia
│       └── getUserEmailByUniqueCode.ts  # Busca email por un código único
├── .next/                         # Archivos generados por Next.js (ignorar/oculto)
├── docs/                          # Documentación del proyecto
│   ├── etapas-de-desarrollo.md
│   ├── funciones.md
│   ├── main-menu.md
│   ├── roles.md
│   └── tree.md                    # Estructura de carpetas (este archivo)
├── netlify/                       # (Opcional si deseas separar config de Netlify)
│   └── functions/                # [Ver arriba: a veces se fusiona con .netlify/]
├── node_modules/                  # Dependencias instaladas (ignorar/oculto)
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── logo-black.png
│   ├── logo-gold.png
│   ├── logo-white.png
│   ├── logo.png
│   ├── next.svg
│   ├── old-logo.png
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                       # Rutas/páginas (Next.js App Router)
│   │   ├── login/
│   │   │   └── page.tsx          # Página de inicio de sesión
│   │   ├── menu/
│   │   │   ├── mi-estudio/
│   │   │   │   └── page.tsx      # Subpágina del estudio jurídico
│   │   │   └── page.tsx          # Dashboard principal (Hola usuario, código, etc.)
│   │   ├── register/
│   │   │   └── page.tsx          # Página de registro (nombre, apellido, email, pass)
│   │   ├── favicon.ico           # Ícono de pestaña (si no se usa /public)
│   │   ├── globals.css           # CSS global (App Router)
│   │   ├── layout.tsx            # Layout general (App Router)
│   │   └── page.tsx              # Página principal raíz (landing/redirect)
│   ├── components/
│   │   ├── LoginForm.module.css  # Ejemplo de CSS module (si aplica)
│   │   ├── LoginForm.tsx         # Formulario de login
│   │   ├── Menu.tsx              # Opcional: UI/menú del dashboard
│   │   └── MyLawFirm.tsx         # Sección del estudio jurídico
│   ├── context/
│   │   └── AuthContext.tsx       # Contexto de autenticación (Firebase)
│   ├── lib/
│   │   ├── firebase.ts           # Inicializa la app de Firebase
│   │   ├── firebaseAuth.ts       # Métodos de login/register con Firebase
│   │   ├── firebaseUser.ts       # (Opcional) Gestión de usuario en Firebase
│   │   └── mongoose.ts           # Conexión a MongoDB Atlas
│   ├── styles/
│   │   └── global.css            # Estilos globales
│   └── utils/
│       └── generateCode.ts       # Generador de código único (6 dígitos)
├── .env.local                     # Variables de entorno (claves seguras)
├── .gitignore
├── eslint.config.mjs
├── netlify.toml
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
