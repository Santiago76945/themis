themis-legal-assistant/
├── .next/                        # Archivos generados por Next.js (ignorar)
├── docs/                         # Documentación del proyecto (si aplica)
├── netlify/
│   └── functions/
│       ├── auth.ts              # Lógica de autenticación (ideal para login/register con DB)
│       └── db.ts                # Conexión a MongoDB y lógica de persistencia
├── node_modules/                 # Dependencias instaladas
├── public/
│   └── favicon.ico              # Ícono de la pestaña del navegador
├── src/
│   ├── app/                     # Rutas/páginas (Next.js App Router)
│   │   ├── login/
│   │   │   └── page.tsx         # Página de inicio de sesión
│   │   ├── menu/
│   │   │   ├── mi-estudio/
│   │   │   │   └── page.tsx     # Subpágina del estudio jurídico
│   │   │   └── page.tsx         # Dashboard principal (Hola usuario, código, cerrar sesión)
│   │   ├── register/            
│   │   │   └── page.tsx         # Página de registro (nombre, apellido, email, pass)
│   │   ├── layout.tsx           # Layout general para el App Router
│   │   └── page.tsx             # Página principal raíz (puede ser landing o redirect)
│   ├── components/
│   │   ├── LoginForm.tsx        # Formulario de login
│   │   ├── Menu.tsx             # (opcional) UI del dashboard
│   │   └── MyLawFirm.tsx        # Sección del estudio jurídico
│   ├── context/
│   │   └── AuthContext.tsx      # Contexto de autenticación con Firebase
│   ├── lib/
│   │   ├── firebase.ts          # Inicialización de Firebase App
│   │   ├── firebaseAuth.ts      # Métodos para login/register con Firebase
│   │   └── mongoose.ts          # Conexión a MongoDB Atlas
│   ├── styles/
│   └── utils/
│       └── generateCode.ts      # Generador del código único de usuario (6 dígitos)
├── .env.local                    # Variables de entorno (claves seguras)
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
