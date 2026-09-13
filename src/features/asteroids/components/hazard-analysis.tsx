import { DataPanel, StackedFact } from '@/features/asteroids/components/data-panel'
import type { AsteroidDetail } from '@/features/asteroids/types/asteroid'
import { formatOrbitAu } from '@/features/asteroids/utils/format-asteroid'
import { WarningTriangle } from '@/shared/components/icons/feedback/warning-triangle'
import { Text } from '@/shared/components/text/text'

/**
 * Lo que NeoWs publica sobre el riesgo de un objeto.
 *
 * El diseño pide acá la escala de Torino y la probabilidad acumulada de
 * impacto, pero esos dos números no salen de NeoWs: son del sistema Sentry, que
 * es otra API y sólo cubre los objetos que tiene bajo monitoreo. Antes que
 * inventar una evaluación de riesgo, el panel muestra los tres datos que NeoWs
 * sí publica y que dicen lo mismo: el flag oficial de peligrosidad, la
 * distancia mínima entre las dos órbitas y cuánto se confía en la órbita.
 */
export function HazardAnalysis({ asteroid }: { asteroid: AsteroidDetail }) {
  return (
    <DataPanel
      title="Hazard analysis"
      icon={
        <WarningTriangle
          className={
            asteroid.hazardous ? 'size-5 text-destructive' : 'size-5 text-muted-foreground'
          }
        />
      }
    >
      <StackedFact label="PHA status">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 ${asteroid.hazardous ? 'bg-destructive' : 'bg-foreground'}`}
          />
          <Text
            variant="body.3"
            className={asteroid.hazardous ? 'text-destructive' : 'text-foreground'}
          >
            {asteroid.hazardous ? 'Potentially hazardous' : 'Not hazardous'}
          </Text>
        </div>
      </StackedFact>

      <StackedFact label="Min. orbit intersection">
        <Text variant="body.3" className="text-primary-foreground">
          {asteroid.minimumOrbitIntersection !== null
            ? formatOrbitAu(asteroid.minimumOrbitIntersection)
            : 'Not published'}
        </Text>
      </StackedFact>

      <StackedFact label="Orbit uncertainty">
        <Text variant="body.3" className="text-primary-foreground">
          {asteroid.orbitUncertainty !== null
            ? `${asteroid.orbitUncertainty} / 9 ${asteroid.orbitUncertainty === 0 ? '(well determined)' : ''}`.trim()
            : 'Not published'}
        </Text>
      </StackedFact>

      <StackedFact label="Sentry monitoring">
        <Text variant="body.3" className="text-primary-foreground">
          {asteroid.sentry ? 'On the Sentry risk list' : 'Not on the Sentry risk list'}
        </Text>
      </StackedFact>
    </DataPanel>
  )
}
