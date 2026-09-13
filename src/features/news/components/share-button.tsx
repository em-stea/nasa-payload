'use client'

import { useState } from 'react'

import { Share } from '@/shared/components/icons/other/share'
import { Text } from '@/shared/components/text/text'

type ShareButtonProps = {
  /** Absoluta o relativa al sitio; se resuelve al tocar el botón. */
  url: string
  title: string
  /** Muestra la etiqueta al lado del ícono (en el detalle, no en las cards). */
  withLabel?: boolean
}

/**
 * Comparte el artículo copiando el link al portapapeles y avisando que se
 * copió.
 *
 * Vive dentro del link de la card, así que corta la propagación para que
 * tocarlo no navegue a nasa.gov.
 */
export function ShareButton({ url, title, withLabel = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    // Las rutas del sitio llegan relativas; recién en el browser sabemos contra
    // qué origen resolverlas.
    const target = new URL(url, window.location.origin).toString()

    await navigator.clipboard.writeText(target).catch(() => undefined)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copiado' : `Compartir: ${title}`}
      className="flex items-center gap-2 text-basic-500 transition-colors duration-200 hover:cursor-pointer hover:text-foreground"
    >
      {/* size-6 = viewBox 24: deja el glifo en los 12x13.33 del diseño. */}
      <Share className="size-6 shrink-0" aria-hidden="true" />
      {withLabel && (
        <span className="relative hidden sm:inline-grid">
          {/* Reserva el ancho de "Copied" (la más larga) para que el toggle no mueva el layout. */}
          <Text
            variant="meta.3"
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 uppercase"
          >
            Copied
          </Text>
          <Text variant="meta.3" className="col-start-1 row-start-1 uppercase">
            {copied ? 'Copied' : 'Share'}
          </Text>
        </span>
      )}
    </button>
  )
}
