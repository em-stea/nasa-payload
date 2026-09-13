import { NotFoundScreen } from '@/features/not-found/components/not-found-screen'

/**
 * El 404 de las rutas del sitio: las que existen pero no encontraron su dato y
 * llaman a `notFound()` —una nota borrada, un id que no está—.
 *
 * Acá arriba quedan la navbar y el footer, así que la escena descuenta el alto
 * de la barra para seguir entrando en una pantalla. Las URLs que no matchean
 * ninguna ruta no pasan por este archivo: las atiende `global-not-found`.
 */
export default function NotFound() {
  return <NotFoundScreen className="min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)]" />
}
