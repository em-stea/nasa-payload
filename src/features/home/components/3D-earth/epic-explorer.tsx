'use client'

import Image from 'next/image'
import { type ReactNode, useCallback, useEffect, useState } from 'react'

import type { EpicCapture } from '@/features/home/types/epic'
import {
  toCaptureTimestamp,
  toLatitudeLabel,
  toLongitudeLabel,
} from '@/features/home/utils/format-capture'
import { Button } from '@/shared/components/button/button'
import { Text } from '@/shared/components/text/text'
import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'
import { ScrambleValue } from './scramble-value'
import { FLIGHT_DURATION_MS, GlobeEarth } from './wrapper-earth'

type ReadoutProps = {
  label: string
  /** Vacío mientras no haya toma elegida: la lectura queda en guión. */
  value: string
  /** La fecha de captura va en el azul del diseño; las coordenadas, en blanco. */
  accent?: boolean
}

function Readout({ label, value, accent }: ReadoutProps) {
  return (
    <div className="flex flex-col gap-1.25">
      <Text variant="body.2" className="font-normal text-basic-500">
        {label}
      </Text>

      {value ? (
        <ScrambleValue
          key={value}
          value={value}
          className={cn(
            textVariants({ variant: 'body.1' }),
            'leading-6 whitespace-nowrap',
            accent ? 'text-blue-200' : 'text-basic-00',
          )}
        />
      ) : (
        <Text variant="body.1" className="leading-6 text-basic-500">
          —
        </Text>
      )}
    </div>
  )
}

/** El punto sub-satelital de la toma elegida, como la card del diseño. */
function CaptureReadouts({ capture }: { capture: EpicCapture | null }) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 rounded-xl border-t border-l border-basic-00-10 bg-basic-950-60 px-4 pt-4 pb-4 shadow-card backdrop-blur-sm">
      <Readout label="Latitude" value={capture ? toLatitudeLabel(capture) : ''} />
      <Readout label="Longitude" value={capture ? toLongitudeLabel(capture) : ''} />

      <div className="col-span-2 mt-2 border-t border-basic-00-10 pt-2.25">
        <Readout
          label="Capture date"
          value={capture ? toCaptureTimestamp(capture.date) : ''}
          accent
        />
      </div>
    </div>
  )
}

type EpicExplorerProps = {
  captures: EpicCapture[]
  /** La bajada de la sección, renderizada en el server. */
  children: ReactNode
}

export function EpicExplorer({ captures, children }: EpicExplorerProps) {
  const [activeCaptureId, setActiveCaptureId] = useState<string | null>(null)
  /**
   * La foto que está —o estuvo— sobre el globo. Sobrevive a la deselección
   * para que el disco se desvanezca en vez de desaparecer de un frame al otro.
   */
  const [photoCapture, setPhotoCapture] = useState<EpicCapture | null>(null)

  const activeCapture = captures.find(({ id }) => id === activeCaptureId) ?? null

  /**
   * El disco real entra recién cuando el globo terminó de girar: hasta ahí se
   * ve la maniobra, y el cambio de foto queda escondido detrás del fundido.
   */
  useEffect(() => {
    if (!activeCapture) return

    const timeout = setTimeout(() => setPhotoCapture(activeCapture), FLIGHT_DURATION_MS)

    return () => clearTimeout(timeout)
  }, [activeCapture])

  const handleSelectCapture = useCallback((captureId: string) => {
    setActiveCaptureId((current) => (current === captureId ? null : captureId))
  }, [])

  const isPhotoVisible = Boolean(activeCapture) && photoCapture?.id === activeCaptureId

  return (
    // Dos mitades iguales, como el diseño: la bajada y la card miden lo mismo
    // que la columna, así sus bordes coinciden en cualquier ancho.
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        {children}

        <CaptureReadouts capture={activeCapture} />
      </div>

      <div className="flex flex-col items-center gap-4 justify-self-center">
        <div className="relative size-80 rounded-full border border-red-200-30 p-2.5 shadow-[0px_0px_40px_0px_rgba(255,179,173,0.2)] sm:size-96 lg:size-112">
          <div className="size-full rounded-full border border-red-200-30 bg-basic-970 p-2.5">
            <div className="relative size-full overflow-hidden rounded-full border border-basic-00-10 bg-basic-970 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <GlobeEarth
                captures={captures}
                activeCaptureId={activeCaptureId}
                onSelectCapture={handleSelectCapture}
              />

              {photoCapture && (
                <Image
                  src={photoCapture.imageUrl}
                  alt={photoCapture.caption}
                  fill
                  sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 320px"
                  className={cn(
                    // Sobre los pines —el disco real ya es esa toma— y a la
                    // escala del globo, para que el fundido calce.
                    'pointer-events-none z-10 scale-[1.28] object-cover transition-opacity duration-700',
                    isPhotoVisible ? 'opacity-100' : 'opacity-0',
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Siempre montado: si apareciera y desapareciera, el globo saltaría. */}
        <Text
          variant="meta.1"
          className={cn(
            'text-center text-basic-500 transition-opacity duration-500',
            activeCapture ? 'opacity-0' : 'opacity-100',
          )}
        >
          Pick a capture on the globe
        </Text>

        {/* La salida de la toma elegida; en vivo queda encendido, como estado. */}
        <Button
          variant="primary"
          size="xs"
          active={!activeCapture}
          onClick={() => setActiveCaptureId(null)}
        >
          Live globe
        </Button>
      </div>
    </div>
  )
}
