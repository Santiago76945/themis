themis-legal-assistant/
├── netlify/
│   └── functions/
│       ├── auth.ts          # Lógica de autenticación (Firebase/Supabase)
│       └── db.ts            # Conexión y operaciones con MongoDB Atlas
├── public/                  # Imágenes, favicon, etc.
├── src/
│   ├── app/                 # Páginas con App Router (Next.js 13+)
│   │   ├── login/           # Página de inicio de sesión
│   │   │   └── page.tsx
│   │   └── menu/            # Página del menú principal (dashboard)
│   │       └── page.tsx
│   ├── components/          # Componentes UI reutilizables
│   │   ├── LoginForm.tsx
│   │   ├── Menu.tsx
│   │   └── MyLawFirm.tsx    # Sección “Mi estudio jurídico”
│   ├── lib/                 # Configuraciones de Firebase, Mongoose, etc.
│   ├── styles/              # Archivos de Tailwind CSS (si se requiere custom)
│   └── utils/               # Funciones auxiliares, por ejemplo para generar códigos únicos
│       └── generateCode.ts
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json