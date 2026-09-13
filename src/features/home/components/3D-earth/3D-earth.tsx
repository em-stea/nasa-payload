import { getEPIC3DImages } from '@/features/home/services/get-epic-3d-images'
import { Badge } from '@/shared/components/badge/badge'
import { Container } from '@/shared/components/container/container'
import { Heading } from '@/shared/components/heading/heading'
import { Live } from '@/shared/components/icons/other/live'
import { Text } from '@/shared/components/text/text'
import { EpicExplorer } from './epic-explorer'

/**
 * El globo y las fotos del EPIC son la misma escena: cada toma del día queda
 * clavada sobre su punto sub-satelital y, al elegirla, el globo gira hasta ese
 * punto y el disco real se funde encima. La navegación es estado de cliente
 * —vive en `EpicExplorer`—; acá sólo se resuelve el fetch y la bajada.
 */
export default async function ThreeDEarth() {
  const captures = await getEPIC3DImages()

  return (
    <section className="relative my-8 w-full overflow-hidden bg-basic-950 py-12">
      {/* El lavado azul que baja sobre el globo, como en el diseño. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 left-1/2 bg-linear-to-l from-blue-200/5 to-transparent"
      />

      <Container className="relative">
        <EpicExplorer captures={captures}>
          <div className="flex flex-col gap-4">
            <Badge variant="destructive">
              <Live className="size-5" /> LIVE TELEMETRY
            </Badge>

            <Heading variant="title.2">Earth EPIC 3D</Heading>

            <Text variant="body.3" color="basic-300">
              Earth Polychromatic Imaging Camera (EPIC). Positioned at the Earth-Sun Lagrange point
              1, capturing daily, full-disc imagery of our home planet from deep space.
            </Text>
          </div>
        </EpicExplorer>
      </Container>
    </section>
  )
}
