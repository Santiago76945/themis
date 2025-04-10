// netlify/functions/auth.ts

import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  // Aquí se procesa el body recibido (por ejemplo, datos de login)
  const body = JSON.parse(event.body || "{}");
  
  // Se simula una respuesta exitosa (en producción, verificar credenciales)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Autenticación exitosa", user: body.username }),
  };
};
