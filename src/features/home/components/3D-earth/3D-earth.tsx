import { Badge } from '@/shared/components/badge/badge'
import { Heading } from '@/shared/components/heading/heading'
import { Live } from '@/shared/components/icons/other/live'
import { Text } from '@/shared/components/text/text'
import { GlobeEarth } from './wrapper-earth'
import { getEPIC3DImage } from '../../services/get-epic-3d-image'

export default async function ThreeDEarth() {
  const epic3dImage = await getEPIC3DImage()

  //para ver las imagenes: https://epic.gsfc.nasa.gov/archive/enhanced/2015/10/31/jpg/epic_RGB_20151031003633.jpg
  console.log(epic3dImage)

  return (
    <div className="w-full my-8 bg-basic-940 grid grid-cols-2 py-3">
      <div className="flex flex-col gap-4">
        <Badge variant="destructive">
          <Live className="size-5" /> LIVE TELEMETRY
        </Badge>
        <Heading variant="title.2">Earth EPIC 3D</Heading>

        <Text variant="body.3" color="basic-300" className="max-w-2xl">
          Earth Polychromatic Imaging Camera (EPIC). Positioned at the Earth-Sun Lagrange point 1,
          capturing daily, full-disc imagery of our home planet from deep space.
        </Text>
      </div>

      <div className="flex justify-center items-center">
        <div className="relative size-80 sm:size-96 rounded-full p-2.5 border border-red-300/10 bg-neutral-900/60 shadow-[0_0_25px_rgba(255,255,255,0.07)]">
          <div className="w-full h-full rounded-full p-2.5 border border-red-300/30 bg-black/40">
            <div className="w-full h-full rounded-full overflow-hidden border border-blue-50/10 bg-black relative flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <GlobeEarth />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
