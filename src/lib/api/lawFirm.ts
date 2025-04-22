// src/lib/api/lawFirm.ts

import { callFn } from "./utils";
import type { LawFirm, Invitation } from "./types";

/**
 * Recupera los datos del estudio jurídico al que pertenece el usuario.
 */
export async function getMyLawFirm(userCode: string): Promise<LawFirm> {
  const { firm } = await callFn<{ firm: LawFirm }>(
    `getMyLawFirm?userCode=${encodeURIComponent(userCode)}`
  );
  return firm;
}

/**
 * Crea un nuevo estudio jurídico.
 */
export function createLawFirm(
  name: string,
  managerCode: string
): Promise<{ lawfirm: LawFirm }> {
  return callFn<{ lawfirm: LawFirm }>("createLawFirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, managerCode }),
  });
}

/**
 * Envía una invitación a un abogado para unirse al estudio.
 */
export function inviteToLawFirm(
  lawFirmCode: string,
  invitedUserCode: string,
  managerCode: string
): Promise<{ invitation: Invitation }> {
  return callFn<{ invitation: Invitation }>("inviteToLawFirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lawFirmCode, invitedUserCode, managerCode }),
  });
}

/**
 * Responde (aceptar/rechazar) una invitación pendiente.
 */
export function respondInvitation(
  invitationId: string,
  response: "accepted" | "rejected"
): Promise<{ invitation: Invitation }> {
  return callFn<{ invitation: Invitation }>("respondInvitation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId, response }),
  });
}

/**
 * Obtiene las invitaciones pendientes para un usuario.
 */
export async function getInvitations(
  userCode: string
): Promise<Invitation[]> {
  const { invites } = await callFn<{ invites: Invitation[] }>(
    `getInvitations?userCode=${encodeURIComponent(userCode)}`
  );
  return invites;
}
