import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Instancia de Payload para usar desde el server del blog (Local API).
 *
 * La Local API entra directo al adapter, sin HTTP ni cookies, y por eso
 * también saltea el access control de las colecciones: lo que gobierna quién
 * puede hacer qué en el front son las server actions, que resuelven la sesión
 * de Auth.js antes de tocar la base.
 *
 * `getPayload` cachea la instancia por config, así que llamarla en cada
 * request no reconecta nada.
 */
export function getPayloadClient(): Promise<Payload> {
  return getPayload({ config: configPromise })
}
