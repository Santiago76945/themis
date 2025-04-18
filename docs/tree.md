themis-legal-assistant/
├── .netlify/                      # Configuración y funciones Netlify
│   └── functions/
│       ├── auth.ts
│       ├── createLawFirm.ts          # Nuevo: crea estudios jurídicos
│       ├── createUserProfile.ts
│       ├── getInvitations.ts         # Nuevo: obtiene invitaciones pendientes
│       ├── getMyLawFirm.ts           # Nuevo: obtiene datos del estudio del usuario
│       ├── getUserEmailByUniqueCode.ts
│       ├── getUserProfile.ts
│       ├── inviteToLawFirm.ts        # Nuevo: envía invitaciones a usuarios
│       ├── respondInvitation.ts      # Nuevo: responde invitaciones (aceptar/rechazar)
│       └── db.ts
├── .next/                         # Archivos generados por Next.js (ignorar/oculto)
├── docs/
│   ├── etapas-de-desarrollo.md
│   ├── funciones.md
│   ├── main-menu.md
│   ├── roles.md
│   └── tree.md                    # Este archivo
├── netlify/
│   └── functions/                # (Puede fusionarse con .netlify/functions)
├── node_modules/                 # Dependencias instaladas (ignorar/oculto)
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── logo-black.png
│   ├── logo-gold.png
│   ├── logo-white.png
│   ├── logo.png
│   ├── next.svg
│   ├── old-logo.png              # Nuevo recurso
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── menu/
│   │   │   ├── mi-estudio/
│   │   │   │   └── page.tsx      # MyLawFirm en App Router
│   │   │   └── page.tsx          # Menu principal
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── animatedTexts.json
│   │   ├── ConsoleEffect.tsx
│   │   ├── ConsoleEffectWrapper.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Menu.tsx
│   │   └── MyLawFirm.tsx         # Componente de gestión de estudio
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── firebaseAuth.ts
│   │   ├── firebaseUser.ts
│   │   ├── mongoose.ts
│   │   └── models/                # Nuevos modelos Mongoose
│   │       ├── LawFirm.ts
│   │       └── Invitation.ts
│   ├── styles/
│   │   ├── global.css            # Estilos globales (Tailwind o similares)
│   │   ├── LoginForm.css         # Estilos para LoginForm
│   │   └── Menu.css              # Estilos para Menu
│   └── utils/
│       └── generateCode.ts
├── .env.local
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