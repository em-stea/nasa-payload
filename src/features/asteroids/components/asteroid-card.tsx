'use client'

import Link from 'next/link'
import { ViewTransition } from 'react'

import { AsteroidMesh } from '@/features/asteroids/components/asteroid-mesh'
import { getAsteroidStatus } from '@/features/asteroids/constants/asteroid-status'
import type { Asteroid } from '@/features/asteroids/types/asteroid'
import { buildAsteroidMeshTransitionName } from '@/features/asteroids/utils/build-asteroids-href'
import {
  formatMagnitude,
  formatMissAu,
  formatVelocity,
} from '@/features/asteroids/utils/format-asteroid'
import { Badge } from '@/shared/components/badge/badge'
import { Card } from '@/shared/components/card/card'
import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'

type AsteroidCardProps = {
  asteroid: Asteroid
}

/**
 * Card del DISCOVERY LOG.
 *
 * Es client por el mismo motivo que `NewsArticleCard`: las partes compuestas
 * de `Card` se cuelgan con Object.assign y esas propiedades estáticas no
 * cruzan el borde RSC.
 */

type StatRowProps = {
  label: string
  value: string
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="shrink-0 text-muted-foreground uppercase">{label}:</dt>
      <dd className="truncate text-primary-foreground">{value}</dd>
    </div>
  )
}

export function AsteroidCard({ asteroid }: AsteroidCardProps) {
  const status = getAsteroidStatus(asteroid.status)
  const isCritical = asteroid.status === 'critical'
  const approach = asteroid.approach

  return (
    <Link
      href={asteroid.href}
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
    >
      <Card data={{ title: asteroid.name, tone: status.tone }} className="h-full">
        <Card.Header>
          <ViewTransition name={buildAsteroidMeshTransitionName(asteroid.id)}>
            <AsteroidMesh
              seed={asteroid.id}
              className="text-basic-300 transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </ViewTransition>
        </Card.Header>

        <Card.Body className="flex-1 gap-3 pb-4">
          <div className="flex items-start justify-between gap-2">
            <Card.Title className="line-clamp-2 uppercase" />

            <Badge
              variant={isCritical ? 'alert' : 'media'}
              tone={status.tone}
              title={status.description}
              className="mt-0.5 shrink-0 uppercase"
            >
              {status.label}
            </Badge>
          </div>

          {/* La barra roja del diseño: sólo la lleva la card en alerta. */}
          <dl
            className={cn(
              textVariants({ variant: 'body.3' }),
              'flex w-full flex-col gap-1.5',
              isCritical && 'border-l-2 border-destructive pl-3',
            )}
          >
            <StatRow label="Vel" value={approach ? formatVelocity(approach.velocityKmS) : '—'} />
            <StatRow label="Dist" value={approach ? `${formatMissAu(approach.missAu)} AU` : '—'} />
            <StatRow label="Mag" value={formatMagnitude(asteroid.magnitude)} />
          </dl>
        </Card.Body>
      </Card>
    </Link>
  )
}
