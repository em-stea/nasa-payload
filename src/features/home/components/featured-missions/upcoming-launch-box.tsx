import type {UpcomingLaunch} from "@/features/home/types/launch";

import {Badge} from "@/shared/components/badge/badge";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

type UpcomingLaunchBoxProps = {
  nextUpcomingLaunch: UpcomingLaunch;
};

export const UpcomingLaunchBox = ({nextUpcomingLaunch}: UpcomingLaunchBoxProps) => {
  const {name, date, status, location} = nextUpcomingLaunch;

  return (
    <div className="relative top-0 right-0 z-10 mx-auto mb-6 w-full overflow-hidden rounded-lg p-px md:w-80 lg:absolute lg:right-6 lg:mx-0 lg:mb-0">
      <span
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 340deg, color-mix(in oklch, var(--foreground) 85%, transparent) 355deg, transparent 360deg)",
          animation: "spin 6s linear infinite",
        }}
        className="absolute -inset-full -top-full -left-full h-[300%] w-[300%]"
      />

      <div className="border-blue-200-20 relative flex w-full flex-col gap-2 rounded-[7px] border bg-card-highlight px-6 py-6 backdrop-blur-md">
        <Badge hasDot className="text-blue-200" variant="full-filled">
          UPCOMING // {date}
        </Badge>
        <Heading className="my-2 text-basic-00 uppercase" variant="title.4">
          Mission Status: {status}
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
