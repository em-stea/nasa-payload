import type {ReactNode} from "react";

import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

type TelemetrySectionProps = {
  title: string;
  readout?: string;
  children: ReactNode;
  className?: string;
};

export function TelemetrySection({title, readout, children, className}: TelemetrySectionProps) {
  return (
    <section className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
        <Heading
          as="h2"
          className="leading-7.8 text-6 font-medium tracking-2.4 text-primary-foreground uppercase"
          variant="title.3"
        >
          {title}
        </Heading>

        {readout && (
          <Text className="text-muted-foreground" variant="meta.1">
            {readout}
          </Text>
        )}
      </div>

      {children}
    </section>
  );
}
