// src/app/layout.tsx

import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import "@/styles/global.css";
import ConsoleEffectWrapper from "../components/ConsoleEffectWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Cargar jQuery y el plugin jQuery.TypeIt */}
        <Script src="https://code.jquery.com/jquery-3.0.0.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/jquery.typeit/4.4.0/typeit.min.js" strategy="beforeInteractive" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ConsoleEffectWrapper />
      </body>
    </html>
  );
}

