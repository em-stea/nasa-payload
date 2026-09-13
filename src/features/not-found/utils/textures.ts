import type {PlanetSkin} from "@/features/not-found/constants/scene";

import * as THREE from "three";

/**
 * Texturas de la escena del 404, pintadas en un `<canvas>` al vuelo.
 *
 * Ninguna sale de la red: son treinta y pico de planetas y bajarse un mapa por
 * cada uno para una página de error no se paga. Con bandas, cráteres y grano
 * alcanza para que a este tamaño —cada planeta ocupa unas decenas de píxeles—
 * se lean como cuerpos distintos y no como seis esferas repetidas.
 */

const PLANET_TEXTURE = {width: 512, height: 256} as const;

function createContext(width: number, height: number) {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) throw new Error("No hay contexto 2D para las texturas del 404");

  return context;
}

function toTexture(context: CanvasRenderingContext2D) {
  const texture = new THREE.CanvasTexture(context.canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  // La esfera envuelve la textura a lo largo: sin repetición en X se vería la
  // costura donde se cierra el meridiano.
  texture.wrapS = THREE.RepeatWrapping;

  return texture;
}

function pick<T>(values: readonly T[]) {
  return values[Math.floor(Math.random() * values.length)];
}

/** Grano fino: saca el aspecto de plástico sin llegar a leerse como ruido. */
function addGrain(context: CanvasRenderingContext2D, amount = 14) {
  const {width, height} = context.canvas;
  const image = context.getImageData(0, 0, width, height);
  const {data} = image;

  for (let index = 0; index < data.length; index += 4) {
    const delta = (Math.random() - 0.5) * amount;

    data[index] += delta;
    data[index + 1] += delta;
    data[index + 2] += delta;
  }

  context.putImageData(image, 0, 0);
}

/** Sombreado de polos: oscurece arriba y abajo para insinuar volumen. */
function addPoles(context: CanvasRenderingContext2D) {
  const {width, height} = context.canvas;
  const gradient = context.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "rgba(6, 8, 18, 0.55)");
  gradient.addColorStop(0.25, "rgba(6, 8, 18, 0)");
  gradient.addColorStop(0.75, "rgba(6, 8, 18, 0)");
  gradient.addColorStop(1, "rgba(6, 8, 18, 0.55)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function paintBanded(context: CanvasRenderingContext2D, skin: PlanetSkin) {
  const {width, height} = context.canvas;

  context.fillStyle = skin.base;
  context.fillRect(0, 0, width, height);

  // Las bandas de un gigante gaseoso no tienen borde: el blur las funde.
  context.filter = "blur(3px)";
  for (let y = -8; y < height;) {
    const band = 4 + Math.random() * 20;

    context.globalAlpha = 0.12 + Math.random() * 0.4;
    context.fillStyle = pick(skin.tints);
    context.fillRect(0, y, width, band);
    y += band * (0.7 + Math.random() * 0.7);
  }

  // La tormenta: el guiño a la mancha de Júpiter, chica y en un solo lugar.
  context.globalAlpha = 0.55;
  context.fillStyle = skin.tints[skin.tints.length - 1];
  context.beginPath();
  context.ellipse(width * 0.32, height * 0.62, width * 0.06, height * 0.045, 0, 0, Math.PI * 2);
  context.fill();

  context.filter = "none";
  context.globalAlpha = 1;
}

function paintRocky(context: CanvasRenderingContext2D, skin: PlanetSkin) {
  const {width, height} = context.canvas;

  context.fillStyle = skin.base;
  context.fillRect(0, 0, width, height);

  // Manchones anchos primero: son las mares, lo que da variedad a la distancia.
  context.filter = "blur(12px)";
  for (let index = 0; index < 14; index += 1) {
    context.globalAlpha = 0.18 + Math.random() * 0.22;
    context.fillStyle = pick(skin.tints);
    context.beginPath();
    context.ellipse(
      Math.random() * width,
      Math.random() * height,
      20 + Math.random() * 70,
      14 + Math.random() * 40,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  // Y encima los cráteres, cada uno con su reborde iluminado.
  context.filter = "blur(0.6px)";
  for (let index = 0; index < 90; index += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 1.5 + Math.random() * 7;

    context.globalAlpha = 0.3;
    context.fillStyle = skin.tints[1];
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 0.25;
    context.strokeStyle = skin.tints[skin.tints.length - 1];
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y - radius * 0.2, radius, Math.PI * 1.1, Math.PI * 1.9);
    context.stroke();
  }

  context.filter = "none";
  context.globalAlpha = 1;
}

function paintIcy(context: CanvasRenderingContext2D, skin: PlanetSkin) {
  const {width, height} = context.canvas;

  context.fillStyle = skin.base;
  context.fillRect(0, 0, width, height);

  context.filter = "blur(8px)";
  for (let index = 0; index < 26; index += 1) {
    context.globalAlpha = 0.15 + Math.random() * 0.3;
    context.fillStyle = pick(skin.tints);
    context.beginPath();
    context.ellipse(
      Math.random() * width,
      Math.random() * height,
      18 + Math.random() * 60,
      10 + Math.random() * 30,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  // Las grietas: líneas finas tipo Europa.
  context.filter = "none";
  context.globalAlpha = 0.35;
  context.strokeStyle = skin.tints[0];
  context.lineWidth = 1;
  for (let index = 0; index < 18; index += 1) {
    const y = Math.random() * height;

    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(width * 0.3, y + 30, width * 0.6, y - 40, width, y + 10);
    context.stroke();
  }

  context.globalAlpha = 1;
}

export function createPlanetTexture(skin: PlanetSkin) {
  const context = createContext(PLANET_TEXTURE.width, PLANET_TEXTURE.height);

  if (skin.kind === "banded") paintBanded(context, skin);
  if (skin.kind === "rocky") paintRocky(context, skin);
  if (skin.kind === "icy") paintIcy(context, skin);

  addPoles(context);
  addGrain(context);

  return toTexture(context);
}

/**
 * El planeta de adelante, el único que se ve de cerca: océanos, continentes,
 * bosque y casquetes. Es el que sostiene los arbolitos y la banderita.
 */
export function createHomeTexture() {
  const context = createContext(1024, 512);
  const {width, height} = context.canvas;

  // Más claro de lo que sería un océano real: el planeta se ve a contraluz,
  // contra el fondo del cielo, y con el azul de verdad quedaba un agujero negro.
  const ocean = context.createLinearGradient(0, 0, 0, height);

  ocean.addColorStop(0, "#3f86c7");
  ocean.addColorStop(0.5, "#2f6ea8");
  ocean.addColorStop(1, "#2a5f93");
  context.fillStyle = ocean;
  context.fillRect(0, 0, width, height);

  // Cada continente es un racimo de elipses: da una costa irregular sin
  // necesidad de ruido procedural.
  const landTones = ["#9aae6a", "#b0b877", "#c4ac73", "#87a463"];

  context.filter = "blur(4px)";
  for (let index = 0; index < 12; index += 1) {
    const centerX = Math.random() * width;
    const centerY = height * 0.2 + Math.random() * height * 0.6;
    const tone = pick(landTones);

    for (let blob = 0; blob < 9; blob += 1) {
      context.globalAlpha = 0.85;
      context.fillStyle = tone;
      context.beginPath();
      context.ellipse(
        centerX + (Math.random() - 0.5) * 150,
        centerY + (Math.random() - 0.5) * 90,
        20 + Math.random() * 55,
        14 + Math.random() * 34,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }

  // Bosques encima de la tierra, apenas más saturados.
  context.globalAlpha = 0.5;
  for (let index = 0; index < 40; index += 1) {
    context.fillStyle = pick(["#5f9660", "#4f8258"]);
    context.beginPath();
    context.ellipse(
      Math.random() * width,
      height * 0.25 + Math.random() * height * 0.5,
      14 + Math.random() * 34,
      9 + Math.random() * 20,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  // Casquetes polares.
  context.globalAlpha = 0.9;
  context.filter = "blur(14px)";
  context.fillStyle = "#e8f1ff";
  context.fillRect(0, 0, width, height * 0.07);
  context.fillRect(0, height * 0.94, width, height * 0.06);

  context.filter = "none";
  context.globalAlpha = 1;
  addPoles(context);
  addGrain(context, 10);

  return toTexture(context);
}

/**
 * Anillos: una tira de 1px de alto con las divisiones. La geometría remapea sus
 * UV para que esta tira se lea del radio interno al externo.
 */
export function createRingTexture() {
  const context = createContext(1024, 2);
  const {width, height} = context.canvas;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  for (let x = 0; x < width;) {
    const band = 4 + Math.random() * 26;
    const brightness = 0.25 + Math.random() * 0.75;

    context.fillStyle = `rgba(232, 226, 214, ${brightness})`;
    context.fillRect(x, 0, band, height);
    x += band + Math.random() * 6;
  }

  // Un par de divisiones anchas, tipo Cassini, para que no sea un rayado parejo.
  context.fillStyle = "#000000";
  context.fillRect(width * 0.52, 0, width * 0.05, height);
  context.fillRect(width * 0.78, 0, width * 0.025, height);

  const texture = new THREE.CanvasTexture(context.canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
}

/** Punto de luz redondo y suave: sirve de estrella y de mota de polvo. */
export function createSoftDotTexture() {
  const context = createContext(64, 64);
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.65)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(context.canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/** Mancha difusa para las nebulosas del fondo. */
export function createNebulaTexture(color: string) {
  const context = createContext(256, 256);
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

  gradient.addColorStop(0, color);
  gradient.addColorStop(0.35, `${color}55`);
  gradient.addColorStop(1, `${color}00`);

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  // Deformarla un poco evita las tres manchas circulares idénticas del fondo.
  context.globalCompositeOperation = "destination-out";
  for (let index = 0; index < 14; index += 1) {
    context.globalAlpha = 0.25;
    context.beginPath();
    context.arc(Math.random() * 256, Math.random() * 256, 12 + Math.random() * 46, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(context.canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/** Estela de la estrella fugaz: un degradé horizontal con la cabeza a la derecha. */
export function createTrailTexture() {
  const context = createContext(256, 16);
  const gradient = context.createLinearGradient(0, 0, 256, 0);

  gradient.addColorStop(0, "rgba(164, 178, 240, 0)");
  gradient.addColorStop(0.75, "rgba(200, 214, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

  context.fillStyle = gradient;
  context.fillRect(0, 6, 256, 4);
  context.filter = "blur(3px)";
  context.fillRect(0, 6, 256, 4);

  const texture = new THREE.CanvasTexture(context.canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}
