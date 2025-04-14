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
        setTimeout(() => {
          $(`#element-${index}`).typeIt({
            strings: [text],
            speed: 80,
            autoStart: true,
            // Si el plugin lo soporta, también se podría usar un callback aquí:
            // afterComplete: scrollToBottom
          });
        }, delay);
      });
    }

    // Limpiamos el observer al desmontar el componente
    return () => {
      observer.disconnect();
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
