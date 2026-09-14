import {Badge} from "@/shared/components/badge/badge";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

export const UpcomingLaunchBox = ({nextUpcomingLaunch}: {nextUpcomingLaunch: any}) => {
  const {name, date, status, location} = nextUpcomingLaunch;

  return (
    <div className="relative top-0 right-0 z-10 mx-auto mb-6 w-full overflow-hidden rounded-lg p-px md:w-80 lg:absolute lg:right-6 lg:mx-0 lg:mb-0">
      <span
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 340deg, rgba(147, 197, 253, 0.8) 355deg, transparent 360deg)",
          animation: "spin 6s linear infinite",
        }}
        className="absolute -inset-full -top-full -left-full h-[300%] w-[300%]"
      />

      <div className="border-blue-200-20 relative flex w-full flex-col gap-2 rounded-[7px] border bg-basic-960-90 px-6 py-6 backdrop-blur-md">
        {/* Mismo caso que el hero de APOD: la placa es oscura en los dos
            temas, así que el badge se queda en el azul claro. */}
        <Badge hasDot className="text-blue-200">
          UPCOMING // {date}
        </Badge>
        <Heading className="my-2 uppercase" variant="title.4">
          Mission Status: {status?.name || status}
        </Heading>
        <Text color="blue-200" variant="meta.1">
          NAME: {name}
        </Text>
        <Text color="blue-200" variant="meta.1">
          LOCATION: {location}
        </Text>
      </div>
    </div>
  );
};
