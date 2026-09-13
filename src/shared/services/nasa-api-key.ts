/**
 * Clave de `api.nasa.gov`.
 *
 * Sólo la usan services que corren en el server, así que se lee de una
 * variable sin prefijo `NEXT_PUBLIC_`; queda `NEXT_PUBLIC_API_KEY` como
 * fallback porque es la que ya estaba declarada en el `.env` del proyecto.
 *
 * `DEMO_KEY` es el último recurso: funciona sin registrarse pero corta a 30
 * requests por hora y por IP, así que alcanza para levantar el proyecto y no
 * para usarlo.
 */
export function getNasaApiKey() {
  return process.env.NASA_API_KEY ?? process.env.NEXT_PUBLIC_API_KEY ?? "DEMO_KEY";
}
