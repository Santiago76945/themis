themis-legal-assistant/
├── .netlify/
│   └── functions/
│       ├── auth.ts
│       ├── createCaso.ts
│       ├── crearClient.ts
│       ├── createLawFirm.ts
│       ├── createTask.ts             ← NUEVO
│       ├── createUserProfile.ts
│       ├── deleteClient.ts
│       ├── deleteTask.ts             ← NUEVO
│       ├── eliminarCaso.ts
│       ├── getAbogados.ts
│       ├── getClientLog.ts
│       ├── getClients.ts
│       ├── getInvitations.ts
│       ├── getLogCasos.ts
│       ├── getMyLawFirm.ts
│       ├── getTaskLog.ts             ← NUEVO
│       ├── getTasks.ts               ← NUEVO
│       ├── getUserEmailByUniqueCode.ts
│       ├── getUserProfile.ts
│       ├── inviteToLawFirm.ts
│       ├── modificarCaso.ts
│       ├── respondInvitation.ts
│       └── db.ts
├── docs/
│   ├── etapas-de-desarrollo.md
│   ├── funciones.md
│   ├── main-menu.md
│   ├── roles.md
│   └── tree.md
├── node_modules/
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
│   ├── window.svg
│   └── icons/
│       ├── calendar-icon.png
│       ├── clients-icon.png
│       ├── court-file-icon.png
│       ├── finances-icon.png
│       ├── folder-icon.png
│       ├── notifications-icon.png
│       ├── office-icon.png
│       ├── report-icon.png
│       ├── task-icons.png
│       ├── tasks-icon.png            ← NUEVO (asegurar presencia)
│       ├── users-icon.png
│       └── writing-icon.png
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── menu/
│   │   │   ├── mi-estudio/
│   │   │   │   └── page.tsx
│   │   │   ├── casos/
│   │   │   │   └── page.tsx
│   │   │   ├── tasks/                ← NUEVO
│   │   │   │   └── page.tsx          ← NUEVO
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── animatedTexts.json
│   │   ├── ConsoleEffect.tsx
│   │   ├── ConsoleEffectWrapper.tsx
│   │   ├── ClientManager.tsx
│   │   ├── GestionCasos.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Menu.tsx
│   │   ├── MyLawFirm.tsx
│   │   └── TaskManager.tsx           ← NUEVO
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── api.ts                    ← MODIFICADO (sección tareas)
│   │   ├── firebase.ts
│   │   ├── firebaseAuth.ts
│   │   ├── firebaseUser.ts
│   │   ├── mongoose.ts
│   │   └── models/
│   │       ├── Caso.ts
│   │       ├── CasoLog.ts
│   │       ├── Invitation.ts
│   │       ├── LawFirm.ts
│   │       ├── Task.ts               ← NUEVO
│   │       └── TaskLog.ts            ← NUEVO
│   ├── styles/
│   │   ├── global.css
│   │   ├── GestionCasos.module.css
│   │   ├── LoginForm.module.css
│   │   ├── Menu.module.css
│   │   ├── MyLawFirm.module.css
│   │   └── TaskManager.module.css   ← NUEVO
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
