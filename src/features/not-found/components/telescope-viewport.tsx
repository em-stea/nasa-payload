'use client'

import { type ReactNode, useCallback, useState } from 'react'

import { EyepieceOverlay } from './eyepiece-overlay'
import { TelescopeScene } from './telescope-scene'

/**
 * Coreografía de la página: escena, ocular y texto entran en ese orden.
 *
 * El estado que los une es uno solo —si la escena ya se armó—: hasta entonces
 * el canvas está borroso y agrandado (el telescopio sin enfocar) y el ocular,
 * casi cerrado. Cuando avisa, todo abre junto y el texto sube atrás.
 */
export function TelescopeViewport({ children }: { children: ReactNode }) {
  const [isFocused, setIsFocused] = useState(false)
  const handleReady = useCallback(() => setIsFocused(true), [])

  return (
    <>
      <div
        data-focused={isFocused}
        className={[
          'absolute inset-0 scale-105 opacity-0 blur-[14px]',
          'transition-[opacity,filter,transform] duration-[2600ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          'data-[focused=true]:scale-100 data-[focused=true]:opacity-100 data-[focused=true]:blur-[0px]',
          // Sin animaciones, el enfoque no es un efecto: la escena ya está.
          'motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none',
        ].join(' ')}
      >
        <TelescopeScene onReady={handleReady} />
      </div>

      <EyepieceOverlay isOpen={isFocused} />

      {/* El texto se apoya sobre el borde bajo del campo: sin este degradé, el
          copy pelea con las estrellas justo donde tiene que leerse. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[26vh] bg-gradient-to-t from-[#05060a] via-[#05060a]/75 to-transparent"
      />

      <div
        data-focused={isFocused}
        className="relative z-30 mt-auto w-full translate-y-4 opacity-0 transition-[opacity,transform] delay-700 duration-1000 ease-out data-[focused=true]:translate-y-0 data-[focused=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      >
        {children}
      </div>
    </>
  )
}
