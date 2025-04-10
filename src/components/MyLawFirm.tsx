// src/components/MyLawFirm.tsx

"use client";

import { useState } from "react";
import { generateUniqueCode } from "@/utils/generateCode";

export default function MyLawFirm() {
  // Para efectos de ejemplo, usamos un estado local.
  const [hasLawFirm, setHasLawFirm] = useState(false);
  const [lawFirmName, setLawFirmName] = useState("");
  const [lawFirmCode, setLawFirmCode] = useState("");

  const handleCreateLawFirm = () => {
    if (lawFirmName.trim() === "") {
      alert("Ingresá un nombre para el estudio.");
      return;
    }
    // Se genera la clave única de 6 dígitos para el estudio
    const code = generateUniqueCode();
    setLawFirmCode(code);
    setHasLawFirm(true);
    // Aquí también se debería enviar la información al backend para guardar el estudio.
    console.log("Estudio creado:", { lawFirmName, code });
  };

  return (
    <div className="p-4">
      {hasLawFirm ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Estudio Jurídico</h2>
          <p>
            <span className="font-medium">Nombre:</span> {lawFirmName}
          </p>
          <p>
            <span className="font-medium">Clave:</span> {lawFirmCode}
          </p>
          {/* Aquí se pueden agregar funcionalidades futuras: enviar invitaciones, ver solicitudes, etc. */}
        </div>
      ) : (
        <div>
          <p className="mb-4">No es parte de ningún estudio jurídico.</p>
          <input
            type="text"
            value={lawFirmName}
            onChange={(e) => setLawFirmName(e.target.value)}
            placeholder="Nombre del estudio jurídico"
            className="p-2 border rounded mb-2"
          />
          <button
            onClick={handleCreateLawFirm}
            className="bg-green-500 p-2 text-white rounded hover:bg-green-600"
          >
            Agregar estudio
          </button>
        </div>
      )}
    </div>
  );
}
