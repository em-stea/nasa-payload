"use client";

import type {EpicCapture} from "@/features/home/types/epic";
import type {GlobeInstance} from "globe.gl";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";

import {toCaptureTime} from "@/features/home/utils/format-capture";

const GLOBE_IMG_URL = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMG_URL = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png";
// Mismo archivo que servía `raw.githubusercontent.com` —el del ejemplo de
// `globe.gl`—, pero desde el CDN del resto de las texturas: raw responde 503
// detrás de algunos proxies y ahí la capa de nubes no llegaba a cargar.
const CLOUDS_IMG_URL = "https://cdn.jsdelivr.net/npm/globe.gl/example/clouds/clouds.png";
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.006;

/** Altitud de cámara que deja la Tierra entera dentro del recorte circular. */
const CAMERA_ALTITUDE = 1.9;

/** Lo que tarda el globo en girar hasta la toma elegida. */
export const FLIGHT_DURATION_MS = 1200;
/** Los pines flotan apenas por encima de la capa de nubes. */
const MARKER_ALTITUDE = 0.02;
/**
 * WebGL no entiende los tokens del tema —son `oklch()` y `THREE.Color` sólo
 * parsea hex/rgb/hsl—, así que la paleta del globo va literal: el halo es
 * `blue-200` y la atmósfera, el violeta del diseño.
 */
const RING_RGB = "164, 178, 240";
const ATMOSPHERE_COLOR = "#3a228a";

/**
 * Cada toma es un pin sobre su punto sub-satelital: la miniatura real de la
 * foto, en el lugar exacto de la Tierra que estaba mirando el DSCOVR cuando la
 * sacó. Se construye a mano porque la capa HTML de `globe.gl` monta nodos DOM,
 * no JSX.
 */
function createCaptureMarker(capture: EpicCapture, onSelect: () => void, onRequest: () => void) {
  const marker = document.createElement("button");

  marker.type = "button";
  marker.title = `EPIC ${toCaptureTime(capture.date)}`;
  marker.dataset.active = "false";
  marker.className =
    "group pointer-events-auto cursor-pointer rounded-full transition-opacity duration-300";
  marker.addEventListener("click", onSelect);
  // La foto de 2048px empieza a bajar cuando el pin se apunta, no cuando se
  // elige: el archivo del EPIC tarda más que el giro del globo, así que
  // arrancarla con el click deja al lector mirando el globo pelado.
  marker.addEventListener("pointerenter", onRequest);
  marker.addEventListener("focus", onRequest);

  const frame = document.createElement("span");

  frame.className =
    "block size-6 overflow-hidden rounded-full border border-blue-200-30 bg-basic-960 transition-all duration-500 group-hover:border-blue-200 group-data-[active=true]:size-11 group-data-[active=true]:border-blue-200";

  const thumbnail = document.createElement("img");

  thumbnail.src = capture.thumbnailUrl;
  thumbnail.alt = "";
  thumbnail.loading = "lazy";
  thumbnail.decoding = "async";
  thumbnail.className =
    "size-full scale-125 object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100 group-data-[active=true]:opacity-100";

  frame.appendChild(thumbnail);
  marker.appendChild(frame);

  return marker;
}

type GlobeEarthProps = {
  captures: EpicCapture[];
  /** La toma elegida; `null` deja el globo rotando solo. */
  activeCaptureId: string | null;
  onSelectCapture: (captureId: string) => void;
  /** Aviso de que una toma está por elegirse: su foto puede ir bajando. */
  onRequestCapture: (captureId: string) => void;
};

export function GlobeEarth({
  captures,
  activeCaptureId,
  onSelectCapture,
  onRequestCapture,
}: GlobeEarthProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef(new Map<string, HTMLElement>());
  /**
   * La instancia no puede vivir en estado: `globe.gl` devuelve una función y
   * `setState` la tomaría por un updater, llamándola con el estado anterior
   * —o sea, reinicializando el globo contra un nodo nulo—. Va en una ref, y el
   * flag es lo que despierta a los efectos que dependen de ella.
   */
  const globeRef = useRef<GlobeInstance | null>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  /** Los pines se crean una sola vez; el click siempre llama al handler vigente. */
  const selectRef = useRef(onSelectCapture);
  const requestRef = useRef(onRequestCapture);

  useEffect(() => {
    selectRef.current = onSelectCapture;
    requestRef.current = onRequestCapture;
  }, [onSelectCapture, onRequestCapture]);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    if (!container || !wrapper) return;

    let world: GlobeInstance | null = null;
    let animationFrameId: number | undefined;
    let cancelled = false;

    const resizeObserver = new ResizeObserver(() => {
      world?.width(wrapper.clientWidth).height(wrapper.clientHeight);
    });

    resizeObserver.observe(wrapper);

    import("globe.gl").then(({default: Globe}) => {
      if (cancelled) return;

      world = new Globe(container, {
        animateIn: false,
        rendererConfig: {alpha: true, antialias: true},
      })
        .width(wrapper.clientWidth)
        .height(wrapper.clientHeight)
        .globeImageUrl(GLOBE_IMG_URL)
        .bumpImageUrl(BUMP_IMG_URL)
        .backgroundImageUrl("")
        .showAtmosphere(true)
        .atmosphereColor(ATMOSPHERE_COLOR)
        .atmosphereAltitude(0.15)
        .htmlAltitude(MARKER_ALTITUDE)
        .htmlTransitionDuration(0)
        // Los pines del hemisferio de atrás se desvanecen en vez de flotar
        // sobre el globo: al ser DOM, el render de WebGL no los tapa.
        .htmlElementVisibilityModifier((element, isVisible) => {
          element.style.opacity = isVisible ? "1" : "0";
          element.style.pointerEvents = isVisible ? "auto" : "none";
        })
        .ringAltitude(MARKER_ALTITUDE)
        .ringColor(() => (t: number) => `rgba(${RING_RGB}, ${Math.sqrt(1 - t)})`)
        .ringMaxRadius(5)
        .ringPropagationSpeed(1.5)
        .ringRepeatPeriod(900);

      world.pointOfView({lat: 0, lng: 0, altitude: CAMERA_ALTITUDE}, 0);

      // Transparencia del canvas de Three.js
      world.renderer().setClearColor(0x000000, 0);
      world.scene().background = null;

      const controls = world.controls();

      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      // El recorte circular vive de un encuadre fijo: con zoom, la foto del
      // EPIC dejaría de calzar sobre el globo.
      controls.enableZoom = false;

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
        if (cancelled || !world) return;

        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
          new THREE.MeshPhongMaterial({map: cloudsTexture, transparent: true}),
        );

        world.scene().add(clouds);

        const rotateClouds = () => {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
          animationFrameId = requestAnimationFrame(rotateClouds);
        };

        rotateClouds();
      });

      globeRef.current = world;
      setIsGlobeReady(true);
    });

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      world?._destructor();
      globeRef.current = null;
      setIsGlobeReady(false);
      container.innerHTML = "";
    };
  }, []);

  /** Los pines de la tanda del día. */
  useEffect(() => {
    const world = globeRef.current;

    if (!world) return;

    const markers = markersRef.current;

    markers.clear();

    world
      .htmlLat("lat")
      .htmlLng("lng")
      .htmlElement((data) => {
        const capture = data as EpicCapture;
        const marker = createCaptureMarker(
          capture,
          () => selectRef.current(capture.id),
          () => requestRef.current(capture.id),
        );

        markers.set(capture.id, marker);

        return marker;
      })
      .htmlElementsData(captures);

    return () => {
      markers.clear();
      // Por la ref y no por `world`: al desmontar, el efecto de arriba ya
      // destruyó el globo y tocarlo de nuevo tiraría.
      globeRef.current?.htmlElementsData([]);
    };
  }, [isGlobeReady, captures]);

  /** El globo gira hasta la toma elegida y la marca con el halo. */
  useEffect(() => {
    const world = globeRef.current;

    if (!world) return;

    const activeCapture = captures.find(({id}) => id === activeCaptureId) ?? null;

    markersRef.current.forEach((marker, captureId) => {
      marker.dataset.active = String(captureId === activeCaptureId);
    });

    world.ringsData(activeCapture ? [activeCapture] : []);
    world.controls().autoRotate = !activeCapture;

    if (activeCapture) {
      world.pointOfView(
        {lat: activeCapture.lat, lng: activeCapture.lng, altitude: CAMERA_ALTITUDE},
        FLIGHT_DURATION_MS,
      );
    }
  }, [isGlobeReady, captures, activeCaptureId]);

  return (
    // `isolate`: la capa HTML de los pines se pinta con z-index propios y sin
    // un contexto de apilamiento acá se treparía por encima de la foto.
    <div className="relative isolate size-full" ref={wrapperRef}>
      <div ref={containerRef} />
    </div>
  );
}
