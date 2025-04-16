tree.md

themis-legal-assistant/
├── .netlify/                      # (Netlify-specific build/config directory)
│   └── functions/
│       ├── auth.ts
│       ├── createUserProfile.ts
│       ├── getUserProfile.ts
│       ├── db.ts
│       └── getUserEmailByUniqueCode.ts
├── .next/                         # Archivos generados por Next.js (ignorar/oculto)
├── docs/
│   ├── etapas-de-desarrollo.md
│   ├── funciones.md
│   ├── main-menu.md
│   ├── roles.md
│   └── tree.md
├── netlify/
│   └── functions/                # (Puede estar fusionado con .netlify/)
├── node_modules/                 # Dependencias instaladas (ignorar/oculto)
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── logo-black.png
│   ├── logo-gold.png
│   ├── logo-white.png
│   ├── logo.png
│   ├── next.svg
│   ├── old-logo.png              # Nuevo
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── menu/
│   │   │   ├── mi-estudio/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── animatedTexts.json     # Nuevo: textos animados para UI
│   │   ├── ConsoleEffect.tsx      # Nuevo: efecto consola para el dashboard
│   │   ├── ConsoleEffectWrapper.tsx  # Nuevo: contenedor para efectos de consola
│   │   ├── LoginForm.css          # Nuevo: estilos sueltos para el formulario
│   │   ├── LoginForm.tsx
│   │   ├── Menu.tsx
│   │   └── MyLawFirm.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── firebaseAuth.ts
│   │   ├── firebaseUser.ts
│   │   └── mongoose.ts
│   ├── styles/
│   │   └── global.css
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
