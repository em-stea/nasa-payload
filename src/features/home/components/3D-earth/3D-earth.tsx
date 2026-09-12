import { Badge } from '@/shared/components/badge/badge'
import { Heading } from '@/shared/components/heading/heading'
import { Live } from '@/shared/components/icons/other/live'
import { Text } from '@/shared/components/text/text'

export default async function ThreeDEarth() {
  'use cache'

  return (
    <div className="w-full my-8  h-dvh bg-basic-940 flex flex-col gap-4">
      <Badge>
        <Live className="size-5" /> LIVE TELEMETRY
      </Badge>
      <Heading variant="title.2">Earth EPIC 3D</Heading>
      <Text variant="body.3">
        Earth Polychromatic Imaging Camera (EPIC). Positioned at the Earth-Sun Lagrange point 1,
        capturing daily, full-disc imagery of our home planet from deep space.
      </Text>
      {/* <GlobeEarth /> */}
    </div>
  )
}
