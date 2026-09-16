"use client";

import type {EpicCapture} from "@/features/home/types/epic";

import Image from "next/image";
import {type ReactNode, useCallback, useEffect, useState} from "react";

import {
  toCaptureTimestamp,
  toLatitudeLabel,
  toLongitudeLabel,
} from "@/features/home/utils/format-capture";
import {Button} from "@/shared/components/button/button";
import {Text} from "@/shared/components/text/text";
import {textVariants} from "@/shared/styles/components/text";
import {cn} from "@/shared/utils/className-builder";

import {ScrambleValue} from "./scramble-value";
import {FLIGHT_DURATION_MS, GlobeEarth} from "./wrapper-earth";

/** Agrega un id sin romper la identidad del set cuando ya estaba. */
function withId(ids: ReadonlySet<string>, id: string) {
  return ids.has(id) ? ids : new Set(ids).add(id);
}

/**
 * Qué toma está elegida y en qué maniobra. El `turn` existe porque el id no
 * alcanza para distinguir dos elecciones: salir de una toma y volver a entrar
 * tiene que volver a esperar el giro del globo, y sin el contador la llegada
 * de la maniobra anterior seguiría dando por buena a la nueva.
 */
type Selection = {captureId: string | null; turn: number};

function toSelection(current: Selection, captureId: string | null): Selection {
  return {captureId, turn: current.turn + 1};
}

type ReadoutProps = {
  label: string;
  /** Vacío mientras no haya toma elegida: la lectura queda en guión. */
  value: string;
  /** La fecha de captura va en el azul del diseño; las coordenadas, en neutro. */
  accent?: boolean;
};

function Readout({label, value, accent}: ReadoutProps) {
  return (
    <div className="flex flex-col gap-1.25">
      <Text className="font-normal text-secondary-foreground" variant="body.2">
        {label}
      </Text>

      {value ? (
        <ScrambleValue
          className={cn(
            textVariants({variant: "body.1"}),
            "leading-6 whitespace-nowrap",
            accent ? "text-primary" : "text-muted-foreground-text",
          )}
          key={value}
          value={value}
        />
      ) : (
        <Text className="leading-6 text-muted-foreground" variant="body.1">
          —
        </Text>
      )}
    </div>
  );
}

function CaptureReadouts({capture}: {capture: EpicCapture | null}) {
  return (
    <div className="border-border-primary-10 grid w-full grid-cols-2 gap-2 rounded-xl border-t border-l bg-card-readout px-4 pt-4 pb-4 shadow-readout">
      <Readout label="Latitude" value={capture ? toLatitudeLabel(capture) : ""} />
      <Readout label="Longitude" value={capture ? toLongitudeLabel(capture) : ""} />

      <div className="col-span-2 mt-2 border-t border-secondary-border pt-4">
        <Readout
          accent
          label="Capture date"
          value={capture ? toCaptureTimestamp(capture.date) : ""}
        />
      </div>
    </div>
  );
}

type EpicExplorerProps = {
  captures: EpicCapture[];
  children: ReactNode;
};

export function EpicExplorer({captures, children}: EpicExplorerProps) {
  const [selection, setSelection] = useState<Selection>({captureId: null, turn: 0});
  /**
   * Las tomas cuyo disco ya está montado y, por lo tanto, bajando. Entra la
   * elegida y también la que el lector está por elegir: el archivo del EPIC es
   * lento y esos JPG son de 2048px, así que empezar la descarga recién al
   * hacer click se siente como una espera muerta.
   */
  const [requestedIds, setRequestedIds] = useState<ReadonlySet<string>>(() => new Set());
  /** Las que ya terminaron de bajar; sólo esas se pueden mostrar. */
  const [loadedIds, setLoadedIds] = useState<ReadonlySet<string>>(() => new Set());
  /** La maniobra que el globo ya terminó de hacer. */
  const [arrivedTurn, setArrivedTurn] = useState<number | null>(null);

  const activeCaptureId = selection.captureId;
  const activeCapture = captures.find(({id}) => id === activeCaptureId) ?? null;

  const handleRequestCapture = useCallback((captureId: string) => {
    setRequestedIds((current) => withId(current, captureId));
  }, []);

  const handleSelectCapture = useCallback(
    (captureId: string) => {
      handleRequestCapture(captureId);
      setSelection((current) =>
        toSelection(current, current.captureId === captureId ? null : captureId),
      );
    },
    [handleRequestCapture],
  );

  /** El giro del globo hasta la toma elegida. */
  useEffect(() => {
    if (!selection.captureId) return;

    const timeout = setTimeout(() => setArrivedTurn(selection.turn), FLIGHT_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [selection]);

  /**
   * El disco real entra recién cuando el globo terminó de girar *y* la foto
   * terminó de bajar. Esperar sólo al giro no alcanza: un `img` sigue pintando
   * los píxeles de su fuente anterior hasta que decodifica la nueva, así que
   * al revelarlo a ciegas aparecía un rato la toma anterior y recién después
   * la elegida.
   */
  const isPhotoReady =
    activeCaptureId !== null && arrivedTurn === selection.turn && loadedIds.has(activeCaptureId);

  /**
   * Todas las que se pidieron quedan montadas: las que no se ven pesan lo que
   * pesa un `img` transparente y son las que hacen que la elegida ya esté en
   * caché. La que se desmontaría —la anterior— se queda además para poder
   * desvanecerse en vez de desaparecer de un frame al otro.
   */
  const photoCaptures = captures.filter(({id}) => requestedIds.has(id));

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        {children}

        <CaptureReadouts capture={activeCapture} />
      </div>

      <div className="flex flex-col items-center gap-4 justify-self-center">
        <div className="relative size-80 rounded-full border border-destructive/10 p-2.5 shadow-[0px_0px_40px_0px] shadow-destructive/20 sm:size-96 lg:size-112">
          <div className="size-full rounded-full border border-destructive/30 bg-basic-970 p-2.5">
            {/* El visor es siempre el mismo pozo negro: lo que se ve adentro es
                espacio, no chrome del sitio, así que no sigue al tema. */}
            <div className="relative size-full overflow-hidden rounded-full border border-basic-00-10 bg-basic-970 shadow-[inset_0_-40px_100px_1px_rgba(0,0,0,0.9)]">
              <GlobeEarth
                activeCaptureId={activeCaptureId}
                captures={captures}
                onRequestCapture={handleRequestCapture}
                onSelectCapture={handleSelectCapture}
              />

              {photoCaptures.map((capture) => {
                const isVisible = isPhotoReady && capture.id === activeCaptureId;

                return (
                  <Image
                    fill
                    className={cn(
                      // Sobre los pines: el disco real ya es esa toma.
                      "pointer-events-none z-10 object-cover transition-[opacity,scale,filter] duration-1000 ease-out",
                      // Entra desenfocada y un punto más grande, y termina en
                      // la escala del globo —donde el disco calza con la
                      // esfera—: así parece posarse encima en vez de aparecer
                      // de un frame al otro.
                      isVisible
                        ? "scale-[1.28] opacity-100 blur-none"
                        : "scale-[1.34] opacity-0 blur-[6px]",
                    )}
                    alt={isVisible ? capture.caption : ""}
                    key={capture.id}
                    // Se monta para bajar, no para esperar a entrar en pantalla.
                    loading="eager"
                    sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 320px"
                    src={capture.imageUrl}
                    onLoad={() => setLoadedIds((current) => withId(current, capture.id))}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <Text
          className={cn(
            "text-center text-secondary-foreground transition-opacity duration-500",
            activeCapture ? "opacity-0" : "opacity-100",
          )}
          variant="meta.1"
        >
          Pick a capture on the globe
        </Text>

        <Button
          active={!activeCapture}
          size="xs"
          variant="primary"
          onClick={() => setSelection((current) => toSelection(current, null))}
        >
          Live globe
        </Button>
      </div>
    </div>
  );
}
