import * as THREE from "three";

import {FOLIAGE_COLORS, TRUNK_COLOR} from "@/features/not-found/constants/scene";

/**
 * Los cuerpos de la escena: planetas, anillos, vegetación y la chatarra que
 * los orbita. Todo se arma con primitivas —esferas, conos, cilindros— porque a
 * este tamaño un modelo importado no se distinguiría y sí se notaría en la
 * descarga.
 */

const UP = new THREE.Vector3(0, 1, 0);

export type Disposable = {dispose: () => void};

/**
 * WebGL no libera geometrías, materiales ni texturas al desmontar el canvas:
 * hay que pedirlo. Todo lo que se crea pasa por acá y se suelta de una en el
 * cleanup del efecto.
 */
export function createDisposer() {
  const items: Disposable[] = [];

  return {
    track<T extends Disposable>(item: T) {
      items.push(item);

      return item;
    },
    dispose() {
      items.forEach((item) => item.dispose());
      items.length = 0;
    },
  };
}

/**
 * Los planetas son la misma esfera unitaria escalada: una sola geometría para
 * los treinta y pico del glifo.
 */
export function createSphereGeometry() {
  return new THREE.SphereGeometry(1, 48, 32);
}

export function createPlanetMaterial(map: THREE.Texture) {
  return new THREE.MeshStandardMaterial({map, roughness: 0.94, metalness: 0.02});
}

/**
 * Apoya un objeto sobre la superficie de una esfera unitaria y lo para
 * derecho: como el planeta es una esfera de radio 1 escalada, todo lo que
 * cuelga de él ya viene en proporción a su tamaño.
 */
export function placeOnSphere(object: THREE.Object3D, latitude: number, longitude: number) {
  const direction = new THREE.Vector3().setFromSphericalCoords(
    1,
    Math.PI / 2 - latitude,
    longitude,
  );

  object.position.copy(direction);
  object.quaternion.setFromUnitVectors(UP, direction);
}

/**
 * Vegetación: pinos y cactus en verdes apagados. Se comparten geometrías y
 * materiales entre todas las plantas de la escena.
 */
export function createVegetation(disposer: ReturnType<typeof createDisposer>) {
  const trunkGeometry = disposer.track(new THREE.CylinderGeometry(0.018, 0.03, 0.14, 6));
  const canopyGeometry = disposer.track(new THREE.ConeGeometry(0.085, 0.18, 7));
  const crownGeometry = disposer.track(new THREE.ConeGeometry(0.058, 0.13, 7));
  const cactusGeometry = disposer.track(new THREE.CapsuleGeometry(0.035, 0.14, 3, 7));
  const armGeometry = disposer.track(new THREE.CapsuleGeometry(0.022, 0.06, 3, 6));

  const trunkMaterial = disposer.track(
    new THREE.MeshStandardMaterial({color: TRUNK_COLOR, roughness: 1}),
  );
  const foliageMaterials = FOLIAGE_COLORS.map((color) =>
    disposer.track(new THREE.MeshStandardMaterial({color, roughness: 0.85, flatShading: true})),
  );

  function createPine() {
    const pine = new THREE.Group();
    const foliage = foliageMaterials[Math.floor(Math.random() * foliageMaterials.length)];

    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

    trunk.position.y = 0.07;

    const canopy = new THREE.Mesh(canopyGeometry, foliage);

    canopy.position.y = 0.19;

    const crown = new THREE.Mesh(crownGeometry, foliage);

    crown.position.y = 0.3;

    pine.add(trunk, canopy, crown);

    return pine;
  }

  function createCactus() {
    const cactus = new THREE.Group();
    const foliage = foliageMaterials[Math.floor(Math.random() * foliageMaterials.length)];

    const body = new THREE.Mesh(cactusGeometry, foliage);

    body.position.y = 0.1;

    const leftArm = new THREE.Mesh(armGeometry, foliage);

    leftArm.position.set(-0.045, 0.12, 0);
    leftArm.rotation.z = Math.PI / 3;

    const rightArm = new THREE.Mesh(armGeometry, foliage);

    rightArm.position.set(0.045, 0.16, 0);
    rightArm.rotation.z = -Math.PI / 3;

    cactus.add(body, leftArm, rightArm);

    return cactus;
  }

  return {createPine, createCactus};
}

/**
 * Siembra plantas sobre un planeta, a lo largo de una banda de latitudes.
 * Cuelgan del mesh, así que giran con él y aparecen por el limbo.
 */
export function plantVegetation(
  planet: THREE.Object3D,
  vegetation: ReturnType<typeof createVegetation>,
  count: number,
  scale = 1,
) {
  for (let index = 0; index < count; index += 1) {
    const plant = Math.random() > 0.72 ? vegetation.createCactus() : vegetation.createPine();

    placeOnSphere(plant, (Math.random() - 0.5) * 1.5, Math.random() * Math.PI * 2);
    plant.scale.setScalar(scale * (0.75 + Math.random() * 0.5));
    planet.add(plant);
  }
}

/** La banderita del planeta de adelante: un gallardete, sin país ni logo. */
export function createFlag(disposer: ReturnType<typeof createDisposer>) {
  const flag = new THREE.Group();

  const pole = new THREE.Mesh(
    disposer.track(new THREE.CylinderGeometry(0.006, 0.006, 0.34, 5)),
    disposer.track(new THREE.MeshStandardMaterial({color: "#cbd3e8", roughness: 0.5})),
  );

  pole.position.y = 0.17;

  const cloth = new THREE.Mesh(
    disposer.track(new THREE.PlaneGeometry(0.14, 0.08)),
    disposer.track(
      new THREE.MeshStandardMaterial({
        color: "#a4b2f0",
        roughness: 0.7,
        side: THREE.DoubleSide,
      }),
    ),
  );

  cloth.position.set(0.07, 0.29, 0);

  flag.add(pole, cloth);

  return {flag, cloth};
}

/**
 * Anillos. La `RingGeometry` trae UV pensadas para una imagen cuadrada, así
 * que se remapean a lo largo del radio: la textura es una tira de 1px de alto
 * y así cada banda cae en su órbita.
 */
export function createRing(
  disposer: ReturnType<typeof createDisposer>,
  innerRadius: number,
  outerRadius: number,
  texture: THREE.Texture,
) {
  const geometry = disposer.track(new THREE.RingGeometry(innerRadius, outerRadius, 128, 1));
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const vertex = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    const radius = vertex.length();

    uv.setXY(index, (radius - innerRadius) / (outerRadius - innerRadius), 0.5);
  }
  uv.needsUpdate = true;

  const material = disposer.track(
    new THREE.MeshStandardMaterial({
      map: texture,
      alphaMap: texture,
      transparent: true,
      opacity: 0.85,
      roughness: 0.9,
      side: THREE.DoubleSide,
      // Sin esto el anillo tapa por profundidad la mitad trasera de sí mismo.
      depthWrite: false,
    }),
  );

  const ring = new THREE.Mesh(geometry, material);

  ring.rotation.x = -Math.PI / 2;

  return ring;
}

/** El satélite que orbita el gigante: cuerpo, paneles y antena. */
export function createSatellite(disposer: ReturnType<typeof createDisposer>) {
  const satellite = new THREE.Group();

  const hull = disposer.track(new THREE.MeshStandardMaterial({color: "#d5d9e6", roughness: 0.4}));
  const panel = disposer.track(
    new THREE.MeshStandardMaterial({color: "#2f3f8c", roughness: 0.3, metalness: 0.4}),
  );

  const body = new THREE.Mesh(disposer.track(new THREE.BoxGeometry(0.14, 0.12, 0.2)), hull);

  const panelGeometry = disposer.track(new THREE.BoxGeometry(0.02, 0.11, 0.3));
  const leftPanel = new THREE.Mesh(panelGeometry, panel);

  leftPanel.position.x = -0.16;
  const rightPanel = new THREE.Mesh(panelGeometry, panel);

  rightPanel.position.x = 0.16;

  const dish = new THREE.Mesh(
    disposer.track(new THREE.SphereGeometry(0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.4)),
    hull,
  );

  dish.rotation.x = Math.PI / 1.6;
  dish.position.set(0, 0.08, 0.04);

  satellite.add(body, leftPanel, rightPanel, dish);

  return satellite;
}
