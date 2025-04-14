// src/components/ConsoleEffectWrapper.tsx

"use client";

import dynamic from "next/dynamic";

// Se carga el componente ConsoleEffect solo en el cliente (sin SSR)
const ConsoleEffect = dynamic(() => import("./ConsoleEffect"), { ssr: false });

export default function ConsoleEffectWrapper() {
  return <ConsoleEffect />;
}
