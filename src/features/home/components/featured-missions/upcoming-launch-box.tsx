import { Badge } from '@/shared/components/badge/badge'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'

export const UpcomingLaunchBox = ({ nextUpcomingLaunch }: { nextUpcomingLaunch: any }) => {
  const { name, date, status, location } = nextUpcomingLaunch

  return (
    <div className="w-full md:w-80 relative lg:absolute top-0 right-0 lg:right-6 mx-auto lg:mx-0 mb-6 lg:mb-0 z-10 rounded-lg p-px overflow-hidden">
      <span
        className="absolute -inset-full w-[300%] h-[300%] -left-full -top-full"
        style={{
          background:
            'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 340deg, rgba(147, 197, 253, 0.8) 355deg, transparent 360deg)',
          animation: 'spin 6s linear infinite',
        }}
      />

      <div className="relative flex flex-col gap-2 py-6 px-6 rounded-[7px] bg-basic-960-90 border border-blue-200-20 backdrop-blur-md w-full">
        <Badge hasDot>UPCOMING // {date}</Badge>
        <Heading variant="title.4" className="uppercase my-2">
          Mission Status: {status?.name || status}
        </Heading>
        <Text variant="meta.1" color="blue-200">
          NAME: {name}
        </Text>
        <Text variant="meta.1" color="blue-200">
          LOCATION: {location}
        </Text>
      </div>
    </div>
  )
}
