import {textVariants} from "@/shared/styles/components/text";
import {cn} from "@/shared/utils/className-builder";

import {Heading} from "../heading/heading";
import {Text} from "../text/text";

interface TextHeroProps {
  eyebrow: string;
  overline: string;
  title: string;
  description: string;
  hasChip?: {
    active?: boolean;
    label: string;
  }[];
}

export const TextHero = ({eyebrow, overline, title, description, hasChip = []}: TextHeroProps) => {
  return (
    <header className="flex w-full flex-col gap-2.5 border-b border-border pt-20 pb-6">
      <Text className="flex flex-wrap items-baseline gap-2" variant="body.4">
        <span className="text-foreground">{eyebrow}</span>
        <span className="text-basic-500">{overline}</span>
      </Text>

      <Heading as="h1" variant="title.1-bold">
        {title}
      </Heading>

      <Text className="max-w-2xl text-basic-500" variant="body.1">
        {description}
      </Text>

      {hasChip && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {hasChip.map((chip) => (
            <StatusChip active={chip.active} key={chip.label}>
              {chip.label}
            </StatusChip>
          ))}
        </div>
      )}
    </header>
  );
};

/** Chip de estado del hero. No es un control: no lleva foco ni click. */
function StatusChip({children, active = false}: {children: string; active?: boolean}) {
  return (
    <span
      className={cn(
        textVariants({variant: "body.4"}),
        "inline-flex shrink-0 items-center rounded-lg border px-4.25 py-2.25 whitespace-nowrap",
        active
          ? "border-blue-200 bg-blue-200 text-basic-970"
          : "border-border bg-background text-primary-foreground",
      )}
    >
      {children}
    </span>
  );
}
