/**
 * Cliente HTTP mínimo sobre `fetch`.
 *
 * Existe para que los services no repitan el mismo ritual en cada llamada:
 * armar el query string, poner el `Accept`, cortar por timeout, chequear el
 * status y parsear el JSON. Devuelve también `headers` porque varias APIs
 * (la de nasa.gov, sin ir más lejos) mandan la paginación ahí y no en el body.
 */

export type HttpSearchParams = Record<string, string | number | boolean | undefined | null>

export type HttpResponse<TData> = {
  data: TData
  status: number
  headers: Headers
}

export type HttpGetOptions = Omit<RequestInit, 'method' | 'body'> & {
  /** Query string. Las claves con `undefined` o `null` se descartan. */
  searchParams?: HttpSearchParams
  /** Milisegundos antes de abortar el request. */
  timeoutMs?: number
}

/** Error de una respuesta con status fuera del rango 2xx. */
export class HttpError extends Error {
  readonly status: number
  readonly url: string
  /** Cuerpo crudo de la respuesta, recortado; sirve para debuggear el 4xx. */
  readonly body: string

  constructor({ status, url, body }: { status: number; url: string; body: string }) {
    super(`HTTP ${status} en ${url}`)
    this.name = 'HttpError'
    this.status = status
    this.url = url
    this.body = body
  }
}

const DEFAULT_TIMEOUT_MS = 10_000
const ERROR_BODY_MAX_LENGTH = 500

function buildUrl(url: string, searchParams?: HttpSearchParams) {
  if (!searchParams) return url

  const target = new URL(url)

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    target.searchParams.set(key, String(value))
  })

  return target.toString()
}

/** Combina el timeout propio con el `signal` que pueda venir del caller. */
function buildSignal(timeoutMs: number, signal?: AbortSignal | null) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs)

  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal
}

async function get<TData>(
  url: string,
  { searchParams, timeoutMs = DEFAULT_TIMEOUT_MS, signal, headers, ...init }: HttpGetOptions = {},
): Promise<HttpResponse<TData>> {
  const target = buildUrl(url, searchParams)
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }

  const response = await fetch(target, {
    ...init,
    method: 'GET',
    headers: requestHeaders,
    signal: buildSignal(timeoutMs, signal),
  })

  if (!response.ok) {
    throw new HttpError({
      status: response.status,
      url: target,
      body: (await response.text()).slice(0, ERROR_BODY_MAX_LENGTH),
    })
  }

  return {
    data: (await response.json()) as TData,
    status: response.status,
    headers: response.headers,
  }
}

export const http = { get }
