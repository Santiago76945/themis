// src/components/ConsoleEffect.tsx

"use client";

import { useEffect, useRef } from "react";
import animatedTexts from "./animatedTexts.json";

export default function ConsoleEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Función para hacer scroll hasta el final del contenedor
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const $ = (window as any).$;
    const timeoutIds: ReturnType<typeof setTimeout>[] = []; // Guardamos los IDs de los timeouts

    // Configuramos un MutationObserver para detectar cambios en el contenedor
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Configuración de TypeIt para cada línea de texto
    if (typeof window !== "undefined" && $ && $.fn.typeIt) {
      animatedTexts.forEach((text, index) => {
        const delay = index * 4444;
        const timeoutId = setTimeout(() => {
          $(`#element-${index}`).typeIt({
            strings: [text],
            speed: 80,
            autoStart: true,
          });
        }, delay);
        timeoutIds.push(timeoutId); // Almacenamos el ID del timeout
      });
    }

    // Limpiamos el observer y los timeouts al desmontar el componente
    return () => {
      observer.disconnect();
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  return (
    <div className="console-effect" ref={containerRef}>
      {animatedTexts.map((_, index) => (
        <p key={index} id={`element-${index}`}></p>
      ))}
      <style jsx>{`
        .console-effect {
          position: fixed;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          font-family: monospace;
          font-size: 25px;
          color: var(--accent);
          opacity: 0.2;
          white-space: pre-wrap;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
