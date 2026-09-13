"use client";

import type {CSSProperties} from "react";

import {EYEPIECE_CENTER, EYEPIECE_RATIO} from "@/features/not-found/constants/scene";
import {cn} from "@/shared/utils/className-builder";

/**
 * El ocular: todo lo que está entre el ojo del que mira y el cielo.
 *
 * Es DOM y no WebGL a propósito. El recorte circular, la retícula y la mano
 * desenfocada sobre la perilla son capas planas que no tienen por qué pasar
 * por la escena 3D, y acá se animan con CSS —el navegador las compone en la
 * GPU— sin costarle un frame al render de los planetas.
 */

const CENTER_Y = `${EYEPIECE_CENTER * 100}%`;
const OPEN_RADIUS = `min(${EYEPIECE_RATIO.width * 100}vw, ${EYEPIECE_RATIO.height * 100}vh)`;

/** El disco negro con el agujero del ocular. Fuera del radio, tapa todo. */
const SURROUND_MASK = `radial-gradient(circle var(--iris) at 50% ${CENTER_Y}, transparent 0, transparent 97%, #000 100%)`;

/** Caída de luz hacia el borde del campo: ningún ocular ilumina parejo. */
const FIELD_VIGNETTE = `radial-gradient(circle var(--iris) at 50% ${CENTER_Y}, rgba(5, 6, 10, 0) 62%, rgba(5, 6, 10, 0.22) 88%, rgba(5, 6, 10, 0.6) 100%)`;

/**
 * `--iris` se anima, y una custom property sólo se puede animar si está
 * registrada con su tipo. Los keyframes viven acá al lado porque son de esta
 * escena y de ninguna otra.
 *
 * El ocular abre por animación y no por transición atada al estado: así empieza
 * a abrirse con el primer paint, sin esperar a que baje y arranque la escena 3D
 * —que es lo que tarda—, y la página nunca se ve como una pantalla negra.
 */
const OVERLAY_STYLES = `
  @property --iris {
    syntax: '<length>';
    inherits: true;
    initial-value: 1.5vmin;
  }

  @keyframes eyepiece-open {
    from { --iris: 1.5vmin; }
    to { --iris: var(--iris-open); }
  }

  @keyframes eyepiece-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes eyepiece-hand {
    0%   { transform: translate(30%, 48%) rotate(-16deg); opacity: 0; }
    14%  { transform: translate(10%, 18%) rotate(-11deg); opacity: 1; }
    34%  { transform: translate(2%, 7%) rotate(-7deg); opacity: 1; }
    62%  { transform: translate(0%, 5%) rotate(9deg); opacity: 1; }
    88%  { transform: translate(24%, 40%) rotate(5deg); opacity: 0.85; }
    100% { transform: translate(36%, 54%) rotate(3deg); opacity: 0; }
  }

  @keyframes eyepiece-knob {
    0%   { transform: rotate(0deg); }
    30%  { transform: rotate(4deg); }
    64%  { transform: rotate(38deg); }
    100% { transform: rotate(43deg); }
  }
`;

type HudReadoutProps = {
  label: string;
  value: string;
  className?: string;
};

function HudReadout({label, value, className}: HudReadoutProps) {
  return (
    <div
      className={cn(
        "absolute flex gap-2 font-jetbrains-mono text-2_5 leading-3.75 tracking-1 uppercase",
        className,
      )}
      style={{animation: "eyepiece-fade 1200ms ease-out 700ms both"}}
    >
      <span className="text-basic-500/70">{label}</span>
      <span className="text-blue-200/80">{value}</span>
    </div>
  );
}

/** La retícula grabada en el ocular: marcas de campo y el objetivo al centro. */
function Reticle() {
  const ticks = Array.from({length: 24}, (_, index) => index * 15);

  return (
    <svg
      className="size-full"
      fill="none"
      style={{animation: "eyepiece-fade 1400ms ease-out 1100ms both"}}
      viewBox="0 0 200 200"
    >
      <circle
        cx="100"
        cy="100"
        r="94"
        stroke="rgba(164, 178, 240, 0.35)"
        strokeDasharray="0.7 6"
        strokeWidth="0.4"
      />

      {ticks.map((angle) => (
        <line
          key={angle}
          stroke="rgba(164, 178, 240, 0.45)"
          strokeWidth={angle % 90 === 0 ? 0.9 : 0.4}
          transform={`rotate(${angle} 100 100)`}
          x1="100"
          x2="100"
          y1="8"
          y2={angle % 90 === 0 ? 18 : 13}
        />
      ))}

      {/* Cruz filar, cortada al centro para no taparle el 404 a nadie. */}
      {[0, 90, 180, 270].map((angle) => (
        <line
          key={angle}
          stroke="rgba(164, 178, 240, 0.28)"
          strokeWidth="0.5"
          transform={`rotate(${angle} 100 100)`}
          x1="100"
          x2="100"
          y1="30"
          y2="58"
        />
      ))}

      {/* Corchetes del objetivo: encuadran el glifo una vez enfocado. */}
      <g
        className="origin-center opacity-0 transition-all delay-1000 duration-700 group-data-[open=true]:opacity-100"
        stroke="rgba(164, 178, 240, 0.5)"
        strokeLinecap="round"
        strokeWidth="0.7"
      >
        <path d="M34 76v-9h11M166 76v-9h-11M34 124v9h11M166 124v9h-11" />
      </g>
    </svg>
  );
}

/**
 * La mano del que mira, sobre la perilla de enfoque.
 *
 * Está a centímetros del ojo, así que va fuera de foco —un desenfoque de
 * verdad, no una silueta prolija— y en negro casi puro: a esa distancia no le
 * llega luz. Es lo que pone al observador adentro de la escena.
 */
function FocusHand() {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[46vmin] w-[46vmin] max-w-[420px] motion-safe:group-data-[open=true]:block">
      <svg className="size-full" fill="none" viewBox="0 0 260 260">
        {/* La perilla, apenas menos desenfocada: está un poco más lejos. */}
        <g
          style={{
            animation: "eyepiece-knob 3.4s cubic-bezier(0.33, 1, 0.68, 1) both",
            transformOrigin: "186px 186px",
            filter: "blur(2.5px)",
            opacity: 0.6,
          }}
        >
          <circle cx="186" cy="186" fill="#080a11" r="62" />
          <circle cx="186" cy="186" r="62" stroke="rgba(164, 178, 240, 0.22)" strokeWidth="1.5" />
          <circle cx="186" cy="186" r="31" stroke="rgba(164, 178, 240, 0.14)" strokeWidth="1" />
          {Array.from({length: 18}, (_, index) => index * 20).map((angle) => (
            <line
              key={angle}
              stroke="rgba(164, 178, 240, 0.16)"
              strokeWidth="2"
              transform={`rotate(${angle} 186 186)`}
              x1="186"
              x2="186"
              y1="130"
              y2="142"
            />
          ))}
        </g>

        <g
          style={{
            animation: "eyepiece-hand 3.4s cubic-bezier(0.4, 0, 0.2, 1) both",
            filter: "blur(6px)",
          }}
        >
          {/* Un filo azulado bajo la silueta: el rebote del monitor en los nudillos. */}
          <g fill="rgba(126, 148, 230, 0.38)" transform="translate(-7 -9)">
            <ellipse cx="212" cy="248" rx="104" ry="76" transform="rotate(-18 212 248)" />
            <ellipse cx="150" cy="196" rx="30" ry="58" transform="rotate(-52 150 196)" />
            <ellipse cx="176" cy="164" rx="26" ry="54" transform="rotate(-32 176 164)" />
            <ellipse cx="208" cy="152" rx="25" ry="52" transform="rotate(-14 208 152)" />
            <ellipse cx="240" cy="158" rx="23" ry="48" transform="rotate(4 240 158)" />
          </g>

          <g fill="#05060a">
            <ellipse cx="212" cy="248" rx="104" ry="76" transform="rotate(-18 212 248)" />
            <ellipse cx="150" cy="196" rx="30" ry="58" transform="rotate(-52 150 196)" />
            <ellipse cx="176" cy="164" rx="26" ry="54" transform="rotate(-32 176 164)" />
            <ellipse cx="208" cy="152" rx="25" ry="52" transform="rotate(-14 208 152)" />
            <ellipse cx="240" cy="158" rx="23" ry="48" transform="rotate(4 240 158)" />
            {/* El pulgar, cerrando el agarre por debajo. */}
            <ellipse cx="132" cy="252" rx="24" ry="46" transform="rotate(-68 132 252)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

type EyepieceOverlayProps = {
  /** El ocular abre recién cuando la escena está lista para enfocar. */
  isOpen: boolean;
};

export function EyepieceOverlay({isOpen}: EyepieceOverlayProps) {
  return (
    <div
      aria-hidden
      style={
        {
          "--iris-open": OPEN_RADIUS,
          animation: "eyepiece-open 2600ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both",
        } as CSSProperties
      }
      className="group pointer-events-none absolute inset-0 z-20 motion-reduce:animate-none motion-reduce:[--iris:var(--iris-open)]"
      data-open={isOpen}
    >
      <style>{OVERLAY_STYLES}</style>

      <div
        className="absolute inset-0 bg-[#05060a]"
        style={{maskImage: SURROUND_MASK, WebkitMaskImage: SURROUND_MASK}}
      />

      <div className="absolute inset-0" style={{background: FIELD_VIGNETTE}} />

      {/* El canto del ocular: el bisel metálico y el halo de la lente. */}
      <div
        style={{
          left: "50%",
          top: CENTER_Y,
          boxShadow:
            "inset 0 0 60px rgba(164, 178, 240, 0.09), inset 0 0 3px rgba(164, 178, 240, 0.35), 0 0 0 1px rgba(164, 178, 240, 0.16), 0 0 2px 2px rgba(58, 34, 138, 0.5), 0 0 90px rgba(58, 34, 138, 0.35)",
        }}
        className="absolute size-[calc(var(--iris)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <Reticle />
      </div>

      <HudReadout className="top-5 left-5 md:top-8 md:left-8" label="Array" value="40.4 cm · f/8" />
      <HudReadout
        className="top-5 right-5 md:top-8 md:right-8"
        label="Focus"
        value={isOpen ? "locked" : "seeking"}
      />
      {/* Las dos de abajo sólo en pantallas anchas: en mobile se pisan entre
          ellas y con el botón secundario. */}
      <HudReadout
        className="hidden md:bottom-8 md:left-8 md:flex"
        label="RA / Dec"
        value="04h 04m · −40° 04′"
      />
      <HudReadout
        className="hidden md:right-8 md:bottom-8 md:flex"
        label="Exp"
        value="404 ms · iso 1600"
      />

      <FocusHand />
    </div>
  );
}
