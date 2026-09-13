import type {ApodImage} from "@/features/apod/types/apod";
import type {ReactNode} from "react";

import {CheckCircle} from "@/shared/components/icons/feedback/check-circle";
import {Text} from "@/shared/components/text/text";
import {textVariants} from "@/shared/styles/components/text";
import {cn} from "@/shared/utils/className-builder";
import {toMissionTimestamp} from "@/shared/utils/mission-date";

const statVariants = () => textVariants({variant: "meta.1"});

type PanelProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

function Panel({title, action, children}: PanelProps) {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between gap-2 border-b border-border px-2 pt-2 pb-2.25">
        <Text className="text-basic-500" variant="body.4">
          {title}
        </Text>
        {action}
      </header>

      <div className="flex flex-col gap-2 p-4">{children}</div>
    </section>
  );
}

type RowProps = {
  label: string;
  children: ReactNode;
  /** La última fila del panel va sin la línea de abajo. */
  last?: boolean;
};

function Row({label, children, last = false}: RowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        !last && "border-b border-border pb-1.25",
      )}
    >
      <Text className="shrink-0 text-basic-500 uppercase" variant="meta.3">
        {label}
      </Text>
      {children}
    </div>
  );
}

function Value({children, className}: {children: ReactNode; className?: string}) {
  return (
    <Text className={cn("truncate text-primary-foreground", className)} variant="meta.3">
      {children}
    </Text>
  );
}

type StatProps = {
  label: string;
  value: string;
  last?: boolean;
};

/** Fila del resumen, como `<dt>/<dd>` en vez de con `Text`, igual que en `ArticleSidebar`. */
function Stat({label, value, last = false}: StatProps) {
  const base = cn(statVariants(), "tracking-n0_5");

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        !last && "border-b border-basic-00-05 pb-1.25",
      )}
    >
      <dt className={cn(base, "text-basic-500")}>{label}</dt>
      <dd className={cn(base, "text-primary-foreground")}>{value}</dd>
    </div>
  );
}

/**
 * Columna derecha del detalle: los metadatos de la publicación y los créditos
 * de la imagen, que en la APOD son la fuente de verdad —no hay autor de nota,
 * hay un fotógrafo o un instrumento detrás de la foto.
 */
export function ApodSidebar({apod}: {apod: ApodImage}) {
  // El WP suele repetir el mismo texto en `credit` y `copyright`; no tiene
  // sentido mostrarlo dos veces.
  const copyright = apod.copyright && apod.copyright !== apod.credit ? apod.copyright : undefined;

  return (
    <aside className="flex w-full flex-col gap-4">
      <Panel title="Mission parameters">
        <Row label="Target">
          <Value>{apod.mediaType.toUpperCase()}</Value>
        </Row>

        <Row label="Status">
          <Text className="bg-blue-700-20 px-1 text-foreground uppercase" variant="meta.3">
            Active_transmitting
          </Text>
        </Row>

        <Row label="Entry">
          <Value>#{apod.postId}</Value>
        </Row>

        <Row last label="Published">
          <Value>
            <time dateTime={apod.date}>{toMissionTimestamp(apod.date)}</time>
          </Value>
        </Row>
      </Panel>

      <Panel action={<CheckCircle className="size-4 text-foreground" />} title="Attribution">
        <dl className="flex w-full flex-col gap-2">
          <Stat label="Credit" last={!copyright} value={apod.credit ?? "NASA"} />
          {copyright && <Stat last label="Copyright" value={copyright} />}
        </dl>
      </Panel>
    </aside>
  );
}
