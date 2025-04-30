// src/lib/api/utils.ts

/**
 * Generic helper to call a Netlify Function and parse JSON.
 * @param fn The name of the Netlify Function (including any query string).
 * @param opts Optional fetch init options for method, headers, body, etc.
 * @returns The parsed JSON response typed as T.
 * @throws If the response is not ok, throws an Error containing status and response text.
 */

export async function callFn<T>(fn: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`/.netlify/functions/${fn}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error en ${fn}: ${res.status} ${res.statusText} – ${text}`);
  }
  return (await res.json()) as T;
}
