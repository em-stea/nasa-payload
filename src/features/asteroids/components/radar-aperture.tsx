"use client";

import type {Asteroid} from "@/features/asteroids/types/asteroid";

import Link from "next/link";
import {useMemo, useState} from "react";

import {TelemetrySection} from "@/features/asteroids/components/telemetry-section";
import {
  formatDiameterRange,
  formatInteger,
  formatLunar,
  formatMissAu,
  formatVelocity,
} from "@/features/asteroids/utils/format-asteroid";
import {
  BEARING_TICKS,
  buildRadarContacts,
  CENTER,
  clamp,
  FAR_R,
  GLOW_R,
  MAX_AU,
  OUTER_R,
  PLOT_R,
  type RadarContact,
  RANGE_RINGS,
  SAFE_MARGIN,
  SWEEP_EDGE,
  SWEEP_LAYERS,
  SWEEP_RADIUS,
  toPoint,
  toRatio,
  VIEW_SIZE,
} from "@/features/asteroids/utils/radar";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * La pantalla de radar del diseño, mirada desde arriba.
 *
 * Los contactos son los objetos de la página, ubicados por `utils/radar`: el
 * ángulo sale del id y el radio, de la distancia de su aproximación.
 *
 * Cada contacto es un link al detalle y se identifica al pasarle el cursor o
 * al tabular hasta él: sale su nombre al lado del blip y el panel de abajo a
 * la izquierda pasa a leer ese objeto. Antes el radar era decoración —los
 * mismos datos que las cards, pero anónimos—; ahora nombra lo que dibuja, así
 * que los blips son navegación de verdad y no se esconden del lector de
 * pantalla. El resto de la pantalla —anillos, rumbos, barrido— sigue siendo
 * adorno y va en una capa aparte, marcada como tal.
 */

const ORIGIN = `${CENTER}px ${CENTER}px`;

/** Bordes de la zona que se lee entera en cualquier panel. */
const SAFE_LEFT = SAFE_MARGIN;
const SAFE_RIGHT = VIEW_SIZE - SAFE_MARGIN;
const SAFE_TOP = SAFE_MARGIN;
const SAFE_BOTTOM = VIEW_SIZE - SAFE_MARGIN;

/** Radio del área sensible de cada contacto; el blip dibujado es mucho menor. */
const HIT_RADIUS = 23;

/** Media caja del cerco de enganche. */
const LOCK_SIZE = 17;

/** Largo de cada gancho del cerco. */
const LOCK_HOOK = 5;

/**
 * Hasta dónde llega el filo del haz, como fracción del radio del sector.
 *
 * El sector se desvanece con el degradé, pero el filo es una línea sólida: a
 * radio completo se salía de los anillos y se leía como una raya suelta en el
 * panel en vez del frente del barrido.
 */
const EDGE_REACH = OUTER_R / SWEEP_RADIUS;

/** Distancia del rótulo al centro del blip. */
const LABEL_OFFSET = 26;

/** Medidas de la caja del rótulo. */
const LABEL_HEIGHT = 32;
const LABEL_PAD = 7;

/**
 * Ancho de caracter de JetBrains Mono, en los dos cuerpos del rótulo.
 *
 * El SVG se arma en el server y no hay forma de medir el texto, pero la
 * tipografía es monoespaciada: el ancho de la caja sale de contar caracteres.
 */
const NAME_CHAR = 6.6;
const META_CHAR = 5.4;

/** A partir de acá el nombre se corta: la caja no puede crecer para siempre. */
const MAX_NAME = 20;

function toneOf(hazardous: boolean) {
  return hazardous ? "var(--color-destructive)" : "var(--color-foreground)";
}

/** Cerco de enganche: cuatro escuadras alrededor del contacto activo. */
function buildLockPath(x: number, y: number) {
  const left = x - LOCK_SIZE;
  const right = x + LOCK_SIZE;
  const top = y - LOCK_SIZE;
  const bottom = y + LOCK_SIZE;

  return [
    `M ${left} ${top + LOCK_HOOK} L ${left} ${top} L ${left + LOCK_HOOK} ${top}`,
    `M ${right - LOCK_HOOK} ${top} L ${right} ${top} L ${right} ${top + LOCK_HOOK}`,
    `M ${right} ${bottom - LOCK_HOOK} L ${right} ${bottom} L ${right - LOCK_HOOK} ${bottom}`,
    `M ${left + LOCK_HOOK} ${bottom} L ${left} ${bottom} L ${left} ${bottom - LOCK_HOOK}`,
  ].join(" ");
}

/**
 * Rótulo del contacto activo.
 *
 * Sale del lado de adentro cuando el contacto está en la mitad derecha, y la
 * caja queda encajada a la fuerza en la zona segura: es lo único del dibujo
 * que tiene que leerse entero, y el recorte del panel cambia con el ancho de
 * la pantalla. El guión que lo une al blip se estira hasta donde haya quedado
 * la caja, así que si tuvo que correrse un poco se nota de dónde viene.
 */
function ContactLabel({contact}: {contact: RadarContact}) {
  const name =
    contact.asteroid.name.length > MAX_NAME
      ? `${contact.asteroid.name.slice(0, MAX_NAME - 1)}…`
      : contact.asteroid.name;

  const meta = `${formatMissAu(contact.approach.missAu)} AU · ${formatVelocity(contact.approach.velocityKmS)}`;

  const flip = contact.x > CENTER;
  const width = Math.max(name.length * NAME_CHAR, meta.length * META_CHAR) + LABEL_PAD * 2;
  const anchorX = flip ? contact.x - LABEL_OFFSET : contact.x + LABEL_OFFSET;

  const boxX = clamp(flip ? anchorX - width : anchorX, SAFE_LEFT, SAFE_RIGHT - width);
  const boxY = clamp(contact.y, SAFE_TOP + LABEL_HEIGHT / 2, SAFE_BOTTOM - LABEL_HEIGHT / 2);

  const textX = flip ? boxX + width - LABEL_PAD : boxX + LABEL_PAD;
  const tone = toneOf(contact.asteroid.hazardous);

  return (
    <g className="pointer-events-none">
      <line
        opacity="0.55"
        stroke={tone}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        x1={flip ? contact.x - LOCK_SIZE - 1 : contact.x + LOCK_SIZE + 1}
        x2={flip ? boxX + width : boxX}
        y1={contact.y}
        y2={boxY}
      />

      <rect
        fill="var(--color-background)"
        fillOpacity="0.92"
        height={LABEL_HEIGHT}
        rx="5"
        stroke={tone}
        strokeOpacity="0.45"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        width={width}
        x={boxX}
        y={boxY - LABEL_HEIGHT / 2}
      />

      <text
        className="font-jetbrains-mono"
        fill="var(--color-primary-foreground)"
        fontSize="11"
        letterSpacing="0.4"
        textAnchor={flip ? "end" : "start"}
        x={textX}
        y={boxY - 4}
      >
        {name.toUpperCase()}
      </text>

      <text
        className="font-jetbrains-mono"
        fill="var(--color-muted-foreground)"
        fontSize="9"
        textAnchor={flip ? "end" : "start"}
        x={textX}
        y={boxY + 9}
      >
        {meta}
      </text>
    </g>
  );
}

type BlipProps = {
  contact: RadarContact;
  active: boolean;
  dimmed: boolean;
  onActivate: (id: string | null) => void;
};

function Blip({contact, active, dimmed, onActivate}: BlipProps) {
  const {asteroid, approach, x, y} = contact;
  const tone = toneOf(asteroid.hazardous);

  return (
    <Link
      className={cn(
        "pointer-events-auto transition-opacity duration-300 outline-none",
        dimmed && "opacity-35",
      )}
      aria-label={`${asteroid.name} — ${formatMissAu(approach.missAu)} AU`}
      href={asteroid.href}
      onBlur={() => onActivate(null)}
      onFocus={() => onActivate(asteroid.id)}
      onPointerEnter={() => onActivate(asteroid.id)}
      onPointerLeave={() => onActivate(null)}
    >
      {/* El área sensible: sin esto habría que acertarle a un punto de 4. */}
      <circle cx={x} cy={y} fill="transparent" r={HIT_RADIUS} />

      {asteroid.hazardous && (
        <circle
          className="animate-ping [animation-duration:3.2s] motion-reduce:animate-none"
          cx={x}
          cy={y}
          fill={tone}
          opacity="0.35"
          r="11"
          style={{transformOrigin: `${x}px ${y}px`}}
        />
      )}

      <circle
        className="transition-all duration-200"
        cx={x}
        cy={y}
        fill={tone}
        opacity={active ? 0.35 : 0.2}
        r={active ? 13 : 11}
      />

      <circle cx={x} cy={y} fill={tone} r="4" />

      {active && (
        <>
          {/* Vector de alcance: de la Tierra al contacto. */}
          <line
            opacity="0.45"
            stroke={tone}
            strokeDasharray="3 4"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            x1={CENTER}
            x2={x}
            y1={CENTER}
            y2={y}
          />

          <path
            d={buildLockPath(x, y)}
            fill="none"
            stroke={tone}
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />

          <ContactLabel contact={contact} />
        </>
      )}
    </Link>
  );
}

/** Fila del panel de lectura. */
function ReadoutRow({label, value, className}: {label: string; value: string; className?: string}) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <dt className="shrink-0">
        <Text className="text-muted-foreground" variant="meta.1">
          {label}
        </Text>
      </dt>
      <dd className="min-w-0">
        <Text className="truncate text-primary-foreground" variant="meta.1">
          {value}
        </Text>
      </dd>
    </div>
  );
}

export function RadarAperture({asteroids}: {asteroids: Asteroid[]}) {
  const contacts = useMemo(() => buildRadarContacts(asteroids), [asteroids]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const hazardous = asteroids.filter((asteroid) => asteroid.hazardous).length;

  /**
   * Sin nada apuntado, el panel lee el contacto más cercano: deja la lectura
   * en pantalla —que es la que explica para qué sirve pasar el cursor— en vez
   * de un hueco.
   */
  const nearest = contacts.reduce<RadarContact | undefined>(
    (closest, contact) =>
      closest === undefined || contact.approach.missAu < closest.approach.missAu
        ? contact
        : closest,
    undefined,
  );

  const locked = contacts.find((contact) => contact.asteroid.id === activeId);
  const readout = locked ?? nearest;

  /**
   * El contacto apuntado se pinta último: su rótulo se come a los blips que
   * tenga al lado, y no al revés.
   */
  const painted = [...contacts].sort(
    (first, second) =>
      Number(first.asteroid.id === activeId) - Number(second.asteroid.id === activeId),
  );

  return (
    <TelemetrySection readout="[360° sweep active]" title="Radar aperture">
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-muted sm:h-96 lg:h-120">
        {/* El resplandor de fondo va en CSS y no en el SVG: el instrumento se
            escala con el alto del panel, pero el ancho no tiene tope, y esto
            es lo único que tiene que llegar hasta las dos puntas. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_140%_at_50%_50%,var(--color-blue-700-20)_0%,transparent_72%)]"
        />

        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid meet"
          role="presentation"
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        >
          <defs>
            {/* Los dos gradientes van en el espacio del dibujo y no en la caja
                de cada forma: el haz es un sector que no arranca en su propio
                centro, y con las coordenadas relativas el degradé le quedaba
                corrido respecto del centro del radar. */}
            <radialGradient
              cx={CENTER}
              cy={CENTER}
              gradientUnits="userSpaceOnUse"
              id="radar-sweep"
              r={SWEEP_RADIUS}
            >
              <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="0.26" />
              <stop offset="45%" stopColor="var(--color-foreground)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              cx={CENTER}
              cy={CENTER}
              gradientUnits="userSpaceOnUse"
              id="radar-screen"
              r={GLOW_R}
            >
              <stop offset="0%" stopColor="var(--color-blue-700)" stopOpacity="0.24" />
              <stop offset="45%" stopColor="var(--color-blue-700)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--color-blue-700)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* El fósforo de la pantalla: un tinte que se apaga hacia el borde. */}
          <circle cx={CENTER} cy={CENTER} fill="url(#radar-screen)" r={GLOW_R} />

          {/* El haz, de plano: la pantalla se mira desde arriba, así que gira
              en círculo y no hay escorzo que corregir. El filo que va adelante
              en el giro va adentro del mismo grupo —es lo que hace leer el
              barrido como un barrido— y con el trazo sin escalar, que si no el
              tamaño del panel lo engorda. */}
          <g
            className="animate-[spin_12s_linear_infinite] motion-reduce:animate-none"
            style={{transformOrigin: ORIGIN}}
          >
            {SWEEP_LAYERS.map((layer) => (
              <path
                d={layer.path}
                fill="url(#radar-sweep)"
                fillOpacity={layer.opacity}
                key={layer.span}
              />
            ))}

            <line
              opacity="0.32"
              stroke="var(--color-foreground)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              x1={CENTER}
              x2={CENTER + (SWEEP_EDGE.x - CENTER) * EDGE_REACH}
              y1={CENTER}
              y2={CENTER + (SWEEP_EDGE.y - CENTER) * EDGE_REACH}
            />
          </g>

          {/* Los anillos lejanos: fuera del rango de los contactos y cortados
              por el marco, que es lo que hace leer la pantalla como más grande
              que su panel. */}
          <g fill="none" opacity="0.16" stroke="var(--color-muted-foreground)">
            <circle
              cx={CENTER}
              cy={CENTER}
              r={FAR_R}
              strokeDasharray="3 7"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g fill="none" opacity="0.22" stroke="var(--color-muted-foreground)">
            {RANGE_RINGS.map((ring) => (
              <circle
                cx={CENTER}
                cy={CENTER}
                key={ring.au}
                r={PLOT_R * toRatio(ring.au)}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <circle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_R}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />

            {/* La cruz de rumbo llega hasta el anillo de adorno: estirada a
                todo el `viewBox` se leía como dos líneas sueltas del panel y
                no como parte del instrumento. */}
            <line
              strokeDasharray="6 6"
              strokeWidth="0.8"
              x1={CENTER - OUTER_R}
              x2={CENTER + OUTER_R}
              y1={CENTER}
              y2={CENTER}
            />
            <line
              strokeDasharray="6 6"
              strokeWidth="0.8"
              x1={CENTER}
              x2={CENTER}
              y1={CENTER - OUTER_R}
              y2={CENTER + OUTER_R}
            />
          </g>

          {/* Marcas de rumbo, entre el plano y el anillo de adorno. */}
          <g opacity="0.35" stroke="var(--color-muted-foreground)">
            {BEARING_TICKS.map((angle, index) => {
              const major = index % 6 === 0;
              const from = toPoint(angle, 1.08);
              const to = toPoint(angle, major ? 1.24 : 1.17);

              return (
                <line
                  key={angle}
                  strokeWidth={major ? 1.6 : 1}
                  vectorEffect="non-scaling-stroke"
                  x1={from.x}
                  x2={to.x}
                  y1={from.y}
                  y2={to.y}
                />
              );
            })}
          </g>

          {/* El alcance de cada anillo; en mobile el panel no da para leerlos. */}
          <g className="hidden sm:block">
            {RANGE_RINGS.map((ring, index) => (
              <text
                className="font-jetbrains-mono"
                fill="var(--color-muted-foreground)"
                fontSize="9"
                key={ring.au}
                letterSpacing="0.4"
                opacity="0.7"
                textAnchor="middle"
                x={CENTER + PLOT_R * toRatio(ring.au)}
                y={index % 2 === 0 ? CENTER - 8 : CENTER + 17}
              >
                {ring.label}
              </text>
            ))}
          </g>

          {/* La Tierra, en el centro del barrido. */}
          <circle cx={CENTER} cy={CENTER} fill="url(#radar-screen)" r="30" />
          <circle cx={CENTER} cy={CENTER} fill="var(--color-blue-700)" opacity="0.6" r="14" />
          <circle
            cx={CENTER}
            cy={CENTER}
            fill="none"
            r="14"
            stroke="var(--color-foreground)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Viñeta: apaga los bordes para que la pantalla no termine en un corte
            seco contra el marco. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_115%_at_50%_50%,transparent_55%,var(--color-muted)_100%)]"
        />

        {/* Los contactos van en su propia capa: mismo `viewBox` y mismo
            recorte, así que caen exactamente sobre la pantalla de atrás, pero
            sin heredar el `aria-hidden` del adorno. */}
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        >
          {painted.map((contact) => (
            <Blip
              active={contact.asteroid.id === activeId}
              contact={contact}
              dimmed={activeId !== null && contact.asteroid.id !== activeId}
              key={contact.asteroid.id}
              onActivate={setActiveId}
            />
          ))}
        </svg>

        {/* Cuentas y referencia de color, en la misma lectura. */}
        <div className="absolute top-3 left-3 flex flex-col gap-0.5 sm:top-4 sm:left-4">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground" />
            <Text className="text-muted-foreground" variant="meta.1">
              Tracked: {formatInteger(contacts.length).padStart(2, "0")}
            </Text>
          </div>

          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-destructive" />
            <Text className="text-muted-foreground" variant="meta.1">
              Hazardous: {formatInteger(hazardous).padStart(2, "0")}
            </Text>
          </div>
        </div>

        {/* La pista del hover no va en mobile: no hay hover y se le encima a
            las cuentas de la esquina de enfrente. */}
        <Text
          className="absolute top-4 right-4 hidden text-muted-foreground sm:block"
          variant="meta.1"
        >
          [pick a contact]
        </Text>

        {/* La lectura del contacto apuntado. Va en un lugar fijo del panel: el
            rótulo del blip se mueve con el cursor, esto no. */}
        {readout && (
          <div className="absolute bottom-3 left-3 w-fit max-w-[calc(100%-1.5rem)] sm:bottom-4 sm:left-4 sm:max-w-64">
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-background/85 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    readout.asteroid.hazardous ? "bg-destructive" : "bg-foreground",
                  )}
                  aria-hidden="true"
                />
                <Text className="whitespace-nowrap text-muted-foreground" variant="meta.1">
                  [{locked ? "contact lock" : "nearest contact"}]
                </Text>
              </div>

              <Text className="truncate text-primary-foreground" variant="meta.2">
                {readout.asteroid.name}
              </Text>

              <dl className="flex flex-col gap-0.5">
                <ReadoutRow
                  label="Rng"
                  value={`${formatMissAu(readout.approach.missAu)} AU · ${formatLunar(readout.approach.missLunar)}`}
                />
                <ReadoutRow label="Vel" value={formatVelocity(readout.approach.velocityKmS)} />

                {/* En mobile el panel es chico y la ficha entera se le come
                    media pantalla: quedan la distancia y la velocidad. */}
                <ReadoutRow
                  value={formatDiameterRange(
                    readout.asteroid.diameterMinM,
                    readout.asteroid.diameterMaxM,
                  )}
                  className="hidden sm:flex"
                  label="Dia"
                />
                <ReadoutRow
                  className="hidden sm:flex"
                  label="Cpa"
                  value={readout.approach.dateLabel}
                />
              </dl>
            </div>
          </div>
        )}

        <div className="absolute right-4 bottom-4 hidden flex-col items-end gap-0.5 sm:flex">
          <Text className="text-muted-foreground" variant="meta.1">
            Rng: {MAX_AU} AU
          </Text>
          <Text className="text-muted-foreground" variant="meta.1">
            Freq: X-band
          </Text>
        </div>
      </div>
    </TelemetrySection>
  );
}
