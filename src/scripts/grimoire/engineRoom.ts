import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import {
  DEFAULT_GRIMOIRE_SNAPSHOT,
  loadGrimoireSnapshot,
  type GrimoireSnapshot,
  type GrimoireSnapshotLayer,
} from "@/lib/grimoire/snapshot";

const LAYER_GEOMETRY: { id: GrimoireSnapshotLayer["id"]; y: number }[] = [
  { id: "L1", y: 0.4 },
  { id: "L2", y: 2.0 },
  { id: "L3", y: 3.8 },
  { id: "L4", y: 5.6 },
  { id: "L5", y: 7.4 },
];

const DECORATIVE = {
  cyan: 0x00e5ff,
  magenta: 0xff00aa,
  green: 0x39ff14,
  purple: 0xaa44ff,
  amber: 0xffe033,
  darkSteel: 0x1a1a2e,
  gunmetal: 0x14141e,
};

type EngineRoomLayoutMode = "desktop" | "mobilePortrait" | "fullscreen";

interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  bloomStrength: number;
  atomDrawCount: number;
  atomPointScale: number;
  trailDrawCount: number;
  trailAlphaScale: number;
}

const CAMERA_PRESETS: Record<EngineRoomLayoutMode, CameraPreset> = {
  desktop: {
    position: [12, 8, 14],
    target: [0, 3.5, 0],
    fov: 52,
    bloomStrength: 0.35,
    atomDrawCount: 2000,
    atomPointScale: 1,
    trailDrawCount: 150,
    trailAlphaScale: 1,
  },
  mobilePortrait: {
    position: [8, 7.5, 12],
    target: [0, 4.2, 0],
    fov: 58,
    bloomStrength: 0.22,
    atomDrawCount: 1200,
    atomPointScale: 0.78,
    trailDrawCount: 80,
    trailAlphaScale: 0.62,
  },
  fullscreen: {
    position: [7, 7, 11],
    target: [0, 4.4, 0],
    fov: 56,
    bloomStrength: 0.25,
    atomDrawCount: 1400,
    atomPointScale: 0.84,
    trailDrawCount: 100,
    trailAlphaScale: 0.72,
  },
};

interface MountResult {
  dispose(): void;
}

export function mountEngineRoom(wrapper: HTMLElement): MountResult {
  const tooltip = wrapper.querySelector<HTMLElement>("#grimoireTooltip");
  const resetBtn = wrapper.querySelector<HTMLButtonElement>("#grimoireResetBtn");
  const focusLabel = wrapper.querySelector<HTMLElement>("#grimoireFocusLabel");
  const fullscreenBtn =
    wrapper.querySelector<HTMLButtonElement>("#grimoireFullscreenBtn");
  const layerNav = wrapper.querySelector<HTMLElement>("#grimoireLayerNav");
  const diagBody = wrapper.querySelector<HTMLElement>("#grimoireDiagBody");
  const snapshotLabel = wrapper.querySelector<HTMLElement>(
    "#grimoireSnapshotLabel"
  );
  const mobileDiag = wrapper
    .closest("section")
    ?.querySelector<HTMLElement>("#grimoireMobileDiag");

  if (
    !tooltip ||
    !resetBtn ||
    !focusLabel ||
    !fullscreenBtn ||
    !layerNav ||
    !diagBody ||
    !snapshotLabel
  ) {
    return { dispose() {} };
  }

  const navDots = Array.from(
    layerNav.querySelectorAll<HTMLButtonElement>(".layer-nav-dot")
  );
  const disposers: Array<() => void> = [];
  let focusedLayer = -1;
  let layoutMode: EngineRoomLayoutMode = resolveLayoutMode();

  function resolveLayoutMode(): EngineRoomLayoutMode {
    if (document.fullscreenElement === wrapper) return "fullscreen";
    const phonePortrait = window.matchMedia(
      "(max-width: 640px) and (orientation: portrait)"
    ).matches;
    if (
      phonePortrait ||
      (wrapper.clientWidth <= 640 && wrapper.clientHeight > wrapper.clientWidth)
    ) {
      return "mobilePortrait";
    }
    return "desktop";
  }

  function vectorFromTuple(tuple: [number, number, number]) {
    return new THREE.Vector3(tuple[0], tuple[1], tuple[2]);
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06060c, 0.028);
  const initialPreset = CAMERA_PRESETS[layoutMode];

  const camera = new THREE.PerspectiveCamera(
    initialPreset.fov,
    wrapper.clientWidth / wrapper.clientHeight,
    0.1,
    200
  );
  camera.position.copy(vectorFromTuple(initialPreset.position));

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  wrapper.insertBefore(renderer.domElement, wrapper.firstChild);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.target.copy(vectorFromTuple(initialPreset.target));
  controls.minDistance = 4;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.update();

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(wrapper.clientWidth, wrapper.clientHeight),
    0.35,
    0.6,
    0.7
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // Decorative — lighting palette is not snapshot-driven.
  const ambLight = new THREE.AmbientLight(0x111122, 0.6);
  scene.add(ambLight);

  const dirLight1 = new THREE.DirectionalLight(0x4488cc, 0.7);
  dirLight1.position.set(6, 12, 8);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.set(1024, 1024);
  dirLight1.shadow.camera.left = -10;
  dirLight1.shadow.camera.right = 10;
  dirLight1.shadow.camera.top = 10;
  dirLight1.shadow.camera.bottom = -2;
  dirLight1.shadow.bias = -0.001;
  dirLight1.shadow.normalBias = 0.02;
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x4466aa, 0.3);
  dirLight2.position.set(-6, 4, -4);
  scene.add(dirLight2);

  const ptLight1 = new THREE.PointLight(0x00e5ff, 1.0, 25, 1.5);
  ptLight1.position.set(0, 4, 3);
  scene.add(ptLight1);

  const ptLight2 = new THREE.PointLight(0xaa44ff, 0.6, 20, 1.5);
  ptLight2.position.set(-3, 6, -2);
  scene.add(ptLight2);

  const ptLight3 = new THREE.PointLight(0xff44aa, 0.35, 15, 1.5);
  ptLight3.position.set(3, 2, -3);
  scene.add(ptLight3);

  function makeMat(
    color: number,
    opts: {
      roughness?: number;
      metalness?: number;
      emissive?: number;
      emissiveI?: number;
      transparent?: boolean;
      opacity?: number;
    } = {}
  ): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: opts.roughness ?? 0.7,
      metalness: opts.metalness ?? 0.3,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.emissiveI ?? 0,
      transparent: opts.transparent ?? false,
      opacity: opts.opacity ?? 1,
    });
  }

  const machineGroup = new THREE.Group();
  scene.add(machineGroup);

  const basePlat = new THREE.Mesh(
    new THREE.CylinderGeometry(5.5, 6, 0.3, 32),
    makeMat(DECORATIVE.gunmetal, { metalness: 0.6, roughness: 0.5 })
  );
  basePlat.position.y = -0.15;
  basePlat.receiveShadow = true;
  machineGroup.add(basePlat);

  const baseRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.6, 0.04, 8, 64),
    makeMat(DECORATIVE.cyan, {
      emissive: DECORATIVE.cyan,
      emissiveI: 0.6,
    })
  );
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.01;
  machineGroup.add(baseRing);

  const conduitPositions: [number, number, number][] = [
    [3.8, 0, 0],
    [-3.8, 0, 0],
    [0, 0, 3.8],
    [0, 0, -3.8],
  ];
  conduitPositions.forEach((pos) => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 9, 8),
      makeMat(DECORATIVE.darkSteel, { metalness: 0.8, roughness: 0.3 })
    );
    pipe.position.set(pos[0], 4.5, pos[2]);
    pipe.castShadow = true;
    machineGroup.add(pipe);

    const strip = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.14,
        0.14,
        9,
        8,
        1,
        true,
        0,
        Math.PI * 0.3
      ),
      makeMat(DECORATIVE.cyan, {
        emissive: DECORATIVE.cyan,
        emissiveI: 0.25,
        transparent: true,
        opacity: 0.35,
      })
    );
    strip.position.copy(pipe.position);
    machineGroup.add(strip);
  });

  interface LayerRefs {
    group: THREE.Group;
    hitTarget: THREE.Mesh;
    separators: THREE.MeshStandardMaterial[];
    navDot: HTMLButtonElement | undefined;
  }

  const layerRefs: LayerRefs[] = [];

  function makeHit(radius: number, height: number, y: number) {
    const hit = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 32),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.y = y;
    return hit;
  }

  // ── LAYER 1: Substrate ──
  const layer1 = new THREE.Group();
  layer1.position.y = LAYER_GEOMETRY[0].y;
  machineGroup.add(layer1);

  const sep1 = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.03, 8, 64),
    makeMat(DECORATIVE.amber, {
      emissive: DECORATIVE.amber,
      emissiveI: 0.4,
    })
  );
  sep1.rotation.x = Math.PI / 2;
  layer1.add(sep1);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r = 3.2;
    const cabinet = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.0, 0.35),
      makeMat(DECORATIVE.darkSteel, { metalness: 0.7, roughness: 0.4 })
    );
    cabinet.position.set(Math.cos(angle) * r, 0.5, Math.sin(angle) * r);
    cabinet.rotation.y = -angle;
    cabinet.castShadow = true;
    layer1.add(cabinet);

    for (let d = 0; d < 3; d++) {
      const drawer = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.02, 0.01),
        makeMat(0x333344)
      );
      drawer.position.set(
        Math.cos(angle) * r,
        0.25 + d * 0.28,
        Math.sin(angle) * r + (Math.cos(angle) > 0 ? 0.18 : -0.18)
      );
      drawer.rotation.y = -angle;
      layer1.add(drawer);
    }
  }

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + 0.4;
    const reel = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.06, 8, 16),
      makeMat(DECORATIVE.amber, {
        metalness: 0.5,
        emissive: DECORATIVE.amber,
        emissiveI: 0.15,
      })
    );
    reel.position.set(Math.cos(angle) * 2, 0.4, Math.sin(angle) * 2);
    reel.rotation.x = Math.PI / 2;
    layer1.add(reel);
  }

  const l1Hit = makeHit(4.5, 1.2, 0.5);
  layer1.add(l1Hit);
  layerRefs.push({
    group: layer1,
    hitTarget: l1Hit,
    separators: [sep1.material as THREE.MeshStandardMaterial],
    navDot: navDots.find((d) => d.dataset.layerId === "L1"),
  });

  // ── LAYER 2: Chunks ──
  const layer2 = new THREE.Group();
  layer2.position.y = LAYER_GEOMETRY[1].y;
  machineGroup.add(layer2);

  const sep2 = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.03, 8, 64),
    makeMat(DECORATIVE.green, {
      emissive: DECORATIVE.green,
      emissiveI: 0.4,
    })
  );
  sep2.rotation.x = Math.PI / 2;
  layer2.add(sep2);

  const chunkCount = 50;
  const chunkGeo = new THREE.BoxGeometry(0.4, 0.08, 0.25);
  const chunkMat = makeMat(DECORATIVE.green, {
    emissive: DECORATIVE.green,
    emissiveI: 0.25,
    transparent: true,
    opacity: 0.7,
  });
  const chunkMesh = new THREE.InstancedMesh(chunkGeo, chunkMat, chunkCount);
  const chunkDummy = new THREE.Object3D();
  const chunkData: { angle: number; r: number; yOff: number; speed: number }[] = [];
  for (let i = 0; i < chunkCount; i++) {
    const angle = (i / chunkCount) * Math.PI * 2;
    const r = 1.5 + Math.random() * 2.5;
    const yOff = (Math.random() - 0.5) * 0.6;
    chunkDummy.position.set(Math.cos(angle) * r, yOff, Math.sin(angle) * r);
    chunkDummy.rotation.set(Math.random() * 0.3, angle, Math.random() * 0.3);
    chunkDummy.updateMatrix();
    chunkMesh.setMatrixAt(i, chunkDummy.matrix);
    chunkData.push({ angle, r, yOff, speed: 0.06 + Math.random() * 0.08 });
  }
  chunkMesh.instanceMatrix.needsUpdate = true;
  layer2.add(chunkMesh);

  const l2Hit = makeHit(4.5, 1.2, 0);
  layer2.add(l2Hit);
  layerRefs.push({
    group: layer2,
    hitTarget: l2Hit,
    separators: [sep2.material as THREE.MeshStandardMaterial],
    navDot: navDots.find((d) => d.dataset.layerId === "L2"),
  });

  // ── LAYER 3: Taxonomy ──
  const layer3 = new THREE.Group();
  layer3.position.y = LAYER_GEOMETRY[2].y;
  machineGroup.add(layer3);

  const ringColors = [DECORATIVE.cyan, DECORATIVE.purple, DECORATIVE.magenta];
  const ringRadii = [3.0, 2.2, 1.4];
  const taxonomyRings: THREE.Mesh[] = [];
  const layer3Mats: THREE.MeshStandardMaterial[] = [];
  ringColors.forEach((col, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadii[i], 0.05, 8, 64),
      makeMat(col, { emissive: col, emissiveI: 0.5 })
    );
    ring.rotation.x = Math.PI / 2 + (i * 0.25 - 0.25);
    ring.rotation.z = i * 0.5;
    layer3.add(ring);
    taxonomyRings.push(ring);
    if (i === 0) layer3Mats.push(ring.material as THREE.MeshStandardMaterial);

    for (let j = 0; j < 8; j++) {
      const a = (j / 8) * Math.PI * 2;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        makeMat(col, { emissive: col, emissiveI: 0.8 })
      );
      dot.position.set(
        Math.cos(a) * ringRadii[i],
        0,
        Math.sin(a) * ringRadii[i]
      );
      ring.add(dot);
    }
  });

  const l3Hit = makeHit(4.5, 1.2, 0);
  layer3.add(l3Hit);
  layerRefs.push({
    group: layer3,
    hitTarget: l3Hit,
    separators: layer3Mats,
    navDot: navDots.find((d) => d.dataset.layerId === "L3"),
  });

  // ── LAYER 4: Atoms ──
  const layer4 = new THREE.Group();
  layer4.position.y = LAYER_GEOMETRY[3].y;
  machineGroup.add(layer4);

  const sep4 = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.03, 8, 64),
    makeMat(DECORATIVE.magenta, {
      emissive: DECORATIVE.magenta,
      emissiveI: 0.4,
    })
  );
  sep4.rotation.x = Math.PI / 2;
  layer4.add(sep4);

  const atomCount = 2000;
  const atomGeo = new THREE.BufferGeometry();
  const atomPositions = new Float32Array(atomCount * 3);
  const atomColors = new Float32Array(atomCount * 3);
  const atomSizes = new Float32Array(atomCount);
  const atomSpeeds: {
    angSpeed: number;
    ySpeed: number;
    r: number;
    theta: number;
    phi: number;
  }[] = [];
  // Decorative — atom cloud color palette is not snapshot-driven.
  const colChoices = [
    new THREE.Color(DECORATIVE.cyan),
    new THREE.Color(DECORATIVE.magenta),
    new THREE.Color(DECORATIVE.green),
    new THREE.Color(DECORATIVE.purple),
  ];

  for (let i = 0; i < atomCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.5 + Math.random() * 3.5;
    atomPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    atomPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
    atomPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const c = colChoices[Math.floor(Math.random() * colChoices.length)];
    atomColors[i * 3] = c.r;
    atomColors[i * 3 + 1] = c.g;
    atomColors[i * 3 + 2] = c.b;
    atomSizes[i] = 1.5 + Math.random() * 3;
    atomSpeeds.push({
      angSpeed: (Math.random() - 0.5) * 0.2,
      ySpeed: (Math.random() - 0.5) * 0.03,
      r,
      theta,
      phi,
    });
  }
  atomGeo.setAttribute("position", new THREE.BufferAttribute(atomPositions, 3));
  atomGeo.setAttribute("color", new THREE.BufferAttribute(atomColors, 3));
  atomGeo.setAttribute("size", new THREE.BufferAttribute(atomSizes, 1));

  const atomMat = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: renderer.getPixelRatio() },
      uPointScale: { value: initialPreset.atomPointScale },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uPixelRatio;
      uniform float uPointScale;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPointScale * uPixelRatio * (4.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float glow = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(vColor * glow, glow * 0.7);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  atomGeo.setDrawRange(0, initialPreset.atomDrawCount);

  const atomCloud = new THREE.Points(atomGeo, atomMat);
  layer4.add(atomCloud);

  const l4Hit = makeHit(4.5, 1.5, 0);
  layer4.add(l4Hit);
  layerRefs.push({
    group: layer4,
    hitTarget: l4Hit,
    separators: [sep4.material as THREE.MeshStandardMaterial],
    navDot: navDots.find((d) => d.dataset.layerId === "L4"),
  });

  // ── LAYER 5: Edges ──
  const layer5 = new THREE.Group();
  layer5.position.y = LAYER_GEOMETRY[4].y;
  machineGroup.add(layer5);

  const sep5 = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.03, 8, 64),
    makeMat(DECORATIVE.purple, {
      emissive: DECORATIVE.purple,
      emissiveI: 0.4,
    })
  );
  sep5.rotation.x = Math.PI / 2;
  layer5.add(sep5);

  const webNodes: THREE.Vector3[] = [];
  const webNodeCount = 20;
  for (let i = 0; i < webNodeCount; i++) {
    const angle = (i / webNodeCount) * Math.PI * 2;
    const r = 1.0 + Math.random() * 2.8;
    const y = (Math.random() - 0.5) * 1.2;
    const pos = new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);
    webNodes.push(pos);
    const nodeDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      makeMat(DECORATIVE.purple, {
        emissive: DECORATIVE.purple,
        emissiveI: 0.8,
      })
    );
    nodeDot.position.copy(pos);
    layer5.add(nodeDot);
  }

  // Decorative — edge web color palette is not snapshot-driven.
  const edgeColors = [
    DECORATIVE.cyan,
    DECORATIVE.magenta,
    DECORATIVE.green,
    DECORATIVE.purple,
    DECORATIVE.amber,
  ];
  const edgeLinePositions: number[] = [];
  const edgeLineColors: number[] = [];
  for (let i = 0; i < webNodeCount; i++) {
    const connections = 2 + Math.floor(Math.random() * 3);
    for (let c = 0; c < connections; c++) {
      const j =
        (i + 1 + Math.floor(Math.random() * (webNodeCount - 2))) % webNodeCount;
      edgeLinePositions.push(
        webNodes[i].x,
        webNodes[i].y,
        webNodes[i].z,
        webNodes[j].x,
        webNodes[j].y,
        webNodes[j].z
      );
      const col = new THREE.Color(
        edgeColors[Math.floor(Math.random() * edgeColors.length)]
      );
      edgeLineColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
    }
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(edgeLinePositions, 3)
  );
  edgeGeo.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(edgeLineColors, 3)
  );
  const edgeLines = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
  );
  layer5.add(edgeLines);

  const l5Hit = makeHit(4.5, 1.5, 0);
  layer5.add(l5Hit);
  layerRefs.push({
    group: layer5,
    hitTarget: l5Hit,
    separators: [sep5.material as THREE.MeshStandardMaterial],
    navDot: navDots.find((d) => d.dataset.layerId === "L5"),
  });

  // ── Execution Loops ──
  // Decorative — loop signal colors are not snapshot-driven.
  const loopGroup = new THREE.Group();
  loopGroup.position.y = 9.2;
  machineGroup.add(loopGroup);

  const loopSignals: {
    mesh: THREE.Mesh;
    loop: number;
    index: number;
    radius: number;
    speed: number;
  }[] = [];
  const loopColors = [DECORATIVE.cyan, DECORATIVE.magenta];
  for (let l = 0; l < 2; l++) {
    const radius = 2.0 + l * 1.2;
    const track = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.02, 8, 64),
      makeMat(loopColors[l], {
        emissive: loopColors[l],
        emissiveI: 0.25,
        transparent: true,
        opacity: 0.35,
      })
    );
    track.rotation.x = Math.PI / 2;
    loopGroup.add(track);

    for (let s = 0; s < 4; s++) {
      const signal = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        makeMat(loopColors[l], {
          emissive: loopColors[l],
          emissiveI: 1.0,
        })
      );
      loopGroup.add(signal);
      loopSignals.push({
        mesh: signal,
        loop: l,
        index: s,
        radius,
        speed: 0.3 + l * 0.15,
      });
    }
  }

  // ── Conduit trails (decorative cyan, not snapshot-driven) ──
  const trailCount = 150;
  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(trailCount * 3);
  const trailAlphas = new Float32Array(trailCount);
  const trailVelocities: { speed: number; conduitIdx: number; jitter: number }[] =
    [];

  for (let i = 0; i < trailCount; i++) {
    const ci = Math.floor(Math.random() * conduitPositions.length);
    const cp = conduitPositions[ci];
    trailPos[i * 3] = cp[0] + (Math.random() - 0.5) * 0.3;
    trailPos[i * 3 + 1] = Math.random() * 9;
    trailPos[i * 3 + 2] = cp[2] + (Math.random() - 0.5) * 0.3;
    trailAlphas[i] = Math.random();
    trailVelocities.push({
      speed: 0.15 + Math.random() * 0.25,
      conduitIdx: ci,
      jitter: Math.random() * 0.008,
    });
  }
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute("alpha", new THREE.BufferAttribute(trailAlphas, 1));

  const trailMat = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: renderer.getPixelRatio() },
      uTrailAlphaScale: { value: initialPreset.trailAlphaScale },
    },
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      uniform float uTrailAlphaScale;
      uniform float uPixelRatio;
      void main() {
        vAlpha = alpha * uTrailAlphaScale;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 2.0 * uPixelRatio * (3.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float glow = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(0.0, 0.9, 1.0, glow * vAlpha * 0.3);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  trailGeo.setDrawRange(0, initialPreset.trailDrawCount);

  const trailPoints = new THREE.Points(trailGeo, trailMat);
  machineGroup.add(trailPoints);

  const gridHelper = new THREE.GridHelper(30, 40, 0x111133, 0x0a0a1a);
  gridHelper.position.y = -0.3;
  scene.add(gridHelper);

  // ── Snapshot application ──
  let currentSnapshot: GrimoireSnapshot = DEFAULT_GRIMOIRE_SNAPSHOT;

  function applyGrimoireSnapshot(snapshot: GrimoireSnapshot) {
    currentSnapshot = snapshot;

    for (let i = 0; i < snapshot.layers.length && i < layerRefs.length; i++) {
      const layer = snapshot.layers[i];
      const ref = layerRefs[i];
      const colorNum = parseInt(layer.color.slice(1), 16);

      ref.hitTarget.userData = {
        name: layer.name,
        desc: layer.description,
        color: layer.color,
        layerIndex: i,
      };

      for (const mat of ref.separators) {
        mat.color.setHex(colorNum);
        mat.emissive.setHex(colorNum);
      }

      const dot = ref.navDot;
      if (dot) {
        dot.setAttribute("aria-label", layer.name);
        dot.title = layer.name;
        const swatch = dot.querySelector<HTMLElement>(".ln-dot");
        if (swatch) {
          swatch.style.background = layer.color;
          swatch.style.boxShadow = `0 0 6px ${layer.color}`;
        }
        const label = dot.querySelector<HTMLElement>(".ln-label");
        if (label) label.textContent = layer.id;
      }
    }

    renderDiagnostics(diagBody!, snapshot);
    if (mobileDiag) renderDiagnostics(mobileDiag, snapshot, true);
    const snapshotLabelFull = snapshotLabel!.querySelector<HTMLElement>(
      "[data-snapshot-label-full]"
    );
    const snapshotLabelShort = snapshotLabel!.querySelector<HTMLElement>(
      "[data-snapshot-label-short]"
    );
    if (snapshotLabelFull && snapshotLabelShort) {
      snapshotLabelFull.textContent = `Snapshot updated ${snapshot.capturedAt}`;
      snapshotLabelShort.textContent = `Updated ${snapshot.capturedAt}`;
    } else {
      snapshotLabel!.textContent = `Snapshot updated ${snapshot.capturedAt}`;
    }
  }

  function renderDiagnostics(
    host: HTMLElement,
    snapshot: GrimoireSnapshot,
    flat = false
  ) {
    while (host.firstChild) host.removeChild(host.firstChild);

    if (flat) {
      for (const d of snapshot.diagnostics) {
        const row = document.createElement("li");
        row.className = `diag-item diag-item-mobile ${d.level}`;
        const dot = document.createElement("span");
        dot.className = `diag-dot ${d.level}`;
        const msg = document.createElement("span");
        msg.textContent = d.message;
        row.appendChild(dot);
        row.appendChild(msg);
        host.appendChild(row);
      }
      return;
    }

    const levels: GrimoireSnapshotDiagnosticLevel[] = ["green", "yellow", "red"];
    for (const level of levels) {
      const items = snapshot.diagnostics.filter((d) => d.level === level);
      if (items.length === 0) continue;
      const title = document.createElement("div");
      title.className = `diag-section-title ${level}`;
      title.textContent = `■ ${level.toUpperCase()}`;
      host.appendChild(title);
      for (const d of items) {
        const row = document.createElement("div");
        row.className = "diag-item";
        const dot = document.createElement("span");
        dot.className = `diag-dot ${level}`;
        const msg = document.createElement("span");
        msg.textContent = d.message;
        row.appendChild(dot);
        row.appendChild(msg);
        host.appendChild(row);
      }
    }
  }

  type GrimoireSnapshotDiagnosticLevel = "green" | "yellow" | "red";

  // Apply default synchronously before first frame.
  applyGrimoireSnapshot(DEFAULT_GRIMOIRE_SNAPSHOT);

  // Async fetch; replace only if a non-default snapshot resolves.
  loadGrimoireSnapshot()
    .then((fetched) => {
      if (fetched !== DEFAULT_GRIMOIRE_SNAPSHOT) {
        applyGrimoireSnapshot(fetched);
      }
    })
    .catch(() => {});

  // ── Layer focus ──
  let cameraAnim: {
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    progress: number;
    duration: number;
  } | null = null;
  const FOCUS_DIM_OPACITY = 0.25;

  function getDefaultCamPos(mode = layoutMode) {
    return vectorFromTuple(CAMERA_PRESETS[mode].position);
  }

  function getDefaultTarget(mode = layoutMode) {
    return vectorFromTuple(CAMERA_PRESETS[mode].target);
  }

  function getFocusCamera(index: number, mode = layoutMode) {
    const targetY = LAYER_GEOMETRY[index].y;
    if (mode === "desktop") {
      return {
        position: new THREE.Vector3(7, targetY + 2.5, 7),
        target: new THREE.Vector3(0, targetY, 0),
      };
    }
    if (mode === "fullscreen") {
      return {
        position: new THREE.Vector3(4.9, targetY + 3.1, 8.4),
        target: new THREE.Vector3(0, targetY + 0.2, 0),
      };
    }
    return {
      position: new THREE.Vector3(5.7, targetY + 3.2, 8.9),
      target: new THREE.Vector3(0, targetY + 0.15, 0),
    };
  }

  function resizeRenderer() {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  }

  function applyRenderPreset(mode: EngineRoomLayoutMode) {
    const preset = CAMERA_PRESETS[mode];
    camera.fov = preset.fov;
    controls.minDistance = mode === "desktop" ? 4 : 3.2;
    controls.maxDistance = mode === "desktop" ? 30 : 20;
    controls.rotateSpeed = mode === "desktop" ? 1 : 0.45;
    controls.zoomSpeed = mode === "desktop" ? 1 : 0.65;
    bloomPass.strength = preset.bloomStrength;
    atomGeo.setDrawRange(0, preset.atomDrawCount);
    trailGeo.setDrawRange(0, preset.trailDrawCount);
    atomMat.uniforms.uPointScale.value = preset.atomPointScale;
    trailMat.uniforms.uTrailAlphaScale.value = preset.trailAlphaScale;
    resizeRenderer();
  }

  function getIntroStart(mode = layoutMode) {
    const preset = CAMERA_PRESETS[mode];
    const lift = mode === "desktop" ? 6 : 4;
    return new THREE.Vector3(
      preset.position[0] * 1.55,
      preset.position[1] + lift,
      preset.position[2] * 1.45
    );
  }

  function syncWrapperModeClass() {
    wrapper.dataset.layoutMode = layoutMode;
    wrapper.classList.toggle(
      "is-mobile-portrait",
      layoutMode === "mobilePortrait"
    );
    wrapper.classList.toggle("is-fullscreen", layoutMode === "fullscreen");
  }

  // ── Cinematic intro ──
  let introTime = 0;
  const introDuration = 3.5;
  let introStartPos = getIntroStart();
  let introEndPos = getDefaultCamPos();
  let introTarget = getDefaultTarget();

  function updateNavHighlight(index: number) {
    for (const dot of navDots) {
      const li = parseInt(dot.dataset.layerId?.replace("L", "") ?? "0", 10) - 1;
      dot.setAttribute("aria-pressed", li === index ? "true" : "false");
    }
  }

  function setGroupOpacityScale(group: THREE.Group, scale: number) {
    group.traverse((child) => {
      const obj = child as THREE.Mesh | THREE.Points | THREE.LineSegments;
      const mat = (obj as { material?: THREE.Material }).material;
      if (!mat) return;
      const matAny = mat as THREE.Material & { opacity?: number };
      if (!matAny.transparent) {
        matAny.transparent = true;
        (obj.userData as Record<string, number>)._origOpacity =
          matAny.opacity ?? 1;
      }
      const orig =
        (obj.userData as Record<string, number>)._origOpacity ??
        matAny.opacity ??
        1;
      (obj.userData as Record<string, number>)._origOpacity = orig;
      matAny.opacity = orig * scale;
    });
  }

  function startCameraAnim(
    toPos: THREE.Vector3,
    toTarget: THREE.Vector3,
    duration = 1.2
  ) {
    cameraAnim = {
      fromPos: camera.position.clone(),
      toPos: toPos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: toTarget.clone(),
      progress: 0,
      duration,
    };
  }

  function focusLayer(index: number) {
    if (focusedLayer === index) return;
    focusedLayer = index;

    const layer = currentSnapshot.layers[index];
    if (!layer) return;
    focusLabel!.textContent = layer.name;
    focusLabel!.style.color = layer.color;
    focusLabel!.classList.add("visible");
    focusLabel!.setAttribute("aria-hidden", "false");
    resetBtn!.classList.add("visible");
    updateNavHighlight(index);

    const focus = getFocusCamera(index);
    startCameraAnim(focus.position, focus.target);

    layerRefs.forEach((ref, i) => {
      setGroupOpacityScale(ref.group, i === index ? 1.0 : FOCUS_DIM_OPACITY);
    });
  }

  function resetFocus() {
    if (focusedLayer === -1) return;
    focusedLayer = -1;
    focusLabel!.classList.remove("visible");
    focusLabel!.setAttribute("aria-hidden", "true");
    resetBtn!.classList.remove("visible");
    updateNavHighlight(-1);
    startCameraAnim(getDefaultCamPos(), getDefaultTarget());
    layerRefs.forEach((ref) => setGroupOpacityScale(ref.group, 1.0));
  }

  function updateLayoutMode(force = false) {
    const nextMode = resolveLayoutMode();
    const changed = nextMode !== layoutMode;
    layoutMode = nextMode;
    syncWrapperModeClass();
    applyRenderPreset(layoutMode);

    if (force) {
      camera.position.copy(getDefaultCamPos());
      controls.target.copy(getDefaultTarget());
      controls.update();
      introStartPos = getIntroStart();
      introEndPos = getDefaultCamPos();
      introTarget = getDefaultTarget();
      return;
    }

    if (!changed) return;
    introTime = introDuration;
    if (focusedLayer >= 0) {
      const focus = getFocusCamera(focusedLayer);
      startCameraAnim(focus.position, focus.target, 0.45);
    } else {
      startCameraAnim(getDefaultCamPos(), getDefaultTarget(), 0.45);
    }
  }

  updateLayoutMode(true);

  // ── Event wiring with disposer tracking ──

  const clickRaycaster = new THREE.Raycaster();
  const clickMouse = new THREE.Vector2();

  const layerHitTargets = layerRefs.map((r) => r.hitTarget);

  const onWrapperClick = (e: MouseEvent) => {
    if (e.target !== renderer.domElement) return;
    const rect = renderer.domElement.getBoundingClientRect();
    clickMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    clickMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    clickRaycaster.setFromCamera(clickMouse, camera);
    const hits = clickRaycaster.intersectObjects(layerHitTargets);
    if (hits.length > 0) {
      const idx = hits[0].object.userData.layerIndex;
      if (typeof idx === "number") focusLayer(idx);
    } else {
      resetFocus();
    }
  };
  wrapper.addEventListener("click", onWrapperClick);
  disposers.push(() => wrapper.removeEventListener("click", onWrapperClick));

  const onResetClick = (e: MouseEvent) => {
    e.stopPropagation();
    resetFocus();
  };
  resetBtn.addEventListener("click", onResetClick);
  disposers.push(() => resetBtn.removeEventListener("click", onResetClick));

  function setFullscreenButtonState(isActive: boolean) {
    fullscreenBtn!.textContent = isActive ? "Exit" : "Fullscreen";
    fullscreenBtn!.setAttribute(
      "aria-label",
      isActive ? "Exit Engine Room fullscreen" : "Open Engine Room fullscreen"
    );
    fullscreenBtn!.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  type OrientationController = ScreenOrientation & {
    lock?: (orientation: string) => Promise<void>;
    unlock?: () => void;
  };

  function getOrientationController() {
    return screen.orientation as OrientationController | undefined;
  }

  async function lockPortraitOrientation() {
    const orientation = getOrientationController();
    if (!orientation?.lock) return;
    await orientation.lock("portrait");
  }

  function unlockOrientation() {
    const orientation = getOrientationController();
    orientation?.unlock?.();
  }

  function syncFullscreenState() {
    const isActive = document.fullscreenElement === wrapper;
    setFullscreenButtonState(isActive);
    if (!isActive) {
      try {
        unlockOrientation();
      } catch {
        // Unsupported on some browsers.
      }
    }
    updateLayoutMode();
  }

  async function enterFullscreen() {
    if (!wrapper.requestFullscreen) return;
    try {
      await wrapper.requestFullscreen({ navigationUI: "hide" });
      try {
        await lockPortraitOrientation();
      } catch {
        // Mobile browsers often reject orientation lock outside narrow cases.
      }
    } catch {
      syncFullscreenState();
    }
  }

  async function exitFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } finally {
      try {
        unlockOrientation();
      } catch {
        // Unsupported on some browsers.
      }
    }
  }

  if (!wrapper.requestFullscreen || !document.exitFullscreen) {
    fullscreenBtn.disabled = true;
    fullscreenBtn.setAttribute("aria-label", "Fullscreen is not available");
  } else {
    const onFullscreenClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (document.fullscreenElement === wrapper) {
        void exitFullscreen();
      } else {
        void enterFullscreen();
      }
    };
    fullscreenBtn.addEventListener("click", onFullscreenClick);
    disposers.push(() =>
      fullscreenBtn.removeEventListener("click", onFullscreenClick)
    );

    const onFullscreenChange = () => {
      syncFullscreenState();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    disposers.push(() =>
      document.removeEventListener("fullscreenchange", onFullscreenChange)
    );
  }

  for (const dot of navDots) {
    const handler = (e: MouseEvent) => {
      e.stopPropagation();
      const id = dot.dataset.layerId ?? "";
      const idx = LAYER_GEOMETRY.findIndex((g) => g.id === id);
      if (idx < 0) return;
      if (focusedLayer === idx) resetFocus();
      else focusLayer(idx);
    };
    dot.addEventListener("click", handler);
    disposers.push(() => dot.removeEventListener("click", handler));
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-100, -100);
  let hoveredLayerName: string | null = null;

  const onMouseMove = (e: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    tooltip.style.left = e.clientX - rect.left + 14 + "px";
    tooltip.style.top = e.clientY - rect.top - 10 + "px";
  };
  wrapper.addEventListener("mousemove", onMouseMove);
  disposers.push(() => wrapper.removeEventListener("mousemove", onMouseMove));

  const onMouseLeave = () => {
    mouse.set(-100, -100);
    tooltip.style.opacity = "0";
    hoveredLayerName = null;
  };
  wrapper.addEventListener("mouseleave", onMouseLeave);
  disposers.push(() => wrapper.removeEventListener("mouseleave", onMouseLeave));

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    updateLayoutMode();
  });
  ro.observe(wrapper);

  // ── Animation ──
  const timer = new THREE.Timer();
  timer.connect(document);
  let frameCount = 0;

  function setTooltipFor(layerIndex: number) {
    const layer = currentSnapshot.layers[layerIndex];
    if (!layer) return;
    while (tooltip!.firstChild) tooltip!.removeChild(tooltip!.firstChild);
    const title = document.createElement("div");
    title.className = "tt-title";
    title.style.color = layer.color;
    title.textContent = layer.name;
    const body = document.createElement("div");
    body.textContent = layer.description;
    tooltip!.appendChild(title);
    tooltip!.appendChild(body);
  }

  function animate(timestamp?: number) {
    timer.update(timestamp);
    const dt = Math.min(timer.getDelta(), 0.05);
    const elapsed = timer.getElapsed();
    frameCount++;

    if (introTime < introDuration) {
      introTime += dt;
      const t = Math.min(introTime / introDuration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(introStartPos, introEndPos, ease);
      camera.lookAt(introTarget);
    }

    if (cameraAnim) {
      cameraAnim.progress += dt / cameraAnim.duration;
      if (cameraAnim.progress >= 1) {
        camera.position.copy(cameraAnim.toPos);
        controls.target.copy(cameraAnim.toTarget);
        cameraAnim = null;
      } else {
        const t = 1 - Math.pow(1 - cameraAnim.progress, 3);
        camera.position.lerpVectors(cameraAnim.fromPos, cameraAnim.toPos, t);
        controls.target.lerpVectors(
          cameraAnim.fromTarget,
          cameraAnim.toTarget,
          t
        );
      }
    }

    controls.update();

    for (let i = 0; i < chunkCount; i++) {
      const cd = chunkData[i];
      cd.angle += cd.speed * dt;
      chunkDummy.position.set(
        Math.cos(cd.angle) * cd.r,
        cd.yOff + Math.sin(elapsed * 0.4 + i) * 0.03,
        Math.sin(cd.angle) * cd.r
      );
      chunkDummy.rotation.set(0, cd.angle, 0);
      chunkDummy.updateMatrix();
      chunkMesh.setMatrixAt(i, chunkDummy.matrix);
    }
    chunkMesh.instanceMatrix.needsUpdate = true;

    taxonomyRings.forEach((ring, i) => {
      ring.rotation.z += (i % 2 === 0 ? 1 : -1) * 0.1 * dt;
    });

    if (frameCount % 2 === 0) {
      const posArr = atomGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < atomCount; i++) {
        const sp = atomSpeeds[i];
        sp.theta += sp.angSpeed * dt;
        posArr[i * 3] = sp.r * Math.sin(sp.phi) * Math.cos(sp.theta);
        const y = posArr[i * 3 + 1] + sp.ySpeed * dt;
        posArr[i * 3 + 1] = y > 0.75 ? -0.75 : y < -0.75 ? 0.75 : y;
        posArr[i * 3 + 2] = sp.r * Math.sin(sp.phi) * Math.sin(sp.theta);
      }
      atomGeo.attributes.position.needsUpdate = true;
    }

    layer5.rotation.y += 0.03 * dt;

    loopSignals.forEach((sig) => {
      const angle = elapsed * sig.speed + (sig.index / 4) * Math.PI * 2;
      sig.mesh.position.set(
        Math.cos(angle) * sig.radius,
        0,
        Math.sin(angle) * sig.radius
      );
    });

    const tp = trailGeo.attributes.position.array as Float32Array;
    const ta = trailGeo.attributes.alpha.array as Float32Array;
    for (let i = 0; i < trailCount; i++) {
      const v = trailVelocities[i];
      tp[i * 3 + 1] += v.speed * dt;
      tp[i * 3] += (Math.random() - 0.5) * v.jitter;
      tp[i * 3 + 2] += (Math.random() - 0.5) * v.jitter;
      if (tp[i * 3 + 1] > 9) {
        const cp = conduitPositions[v.conduitIdx];
        tp[i * 3] = cp[0] + (Math.random() - 0.5) * 0.3;
        tp[i * 3 + 1] = 0;
        tp[i * 3 + 2] = cp[2] + (Math.random() - 0.5) * 0.3;
      }
      ta[i] = (tp[i * 3 + 1] / 9) * 0.6 + 0.1;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.alpha.needsUpdate = true;

    ptLight1.intensity = 1.0 + Math.sin(elapsed * 1.2) * 0.1;
    ptLight2.intensity = 0.6 + Math.sin(elapsed * 1.0 + 1) * 0.08;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(layerHitTargets);
    if (hits.length > 0) {
      const info = hits[0].object.userData as { name?: string; layerIndex?: number };
      if (info.name && hoveredLayerName !== info.name) {
        hoveredLayerName = info.name;
        if (typeof info.layerIndex === "number") {
          setTooltipFor(info.layerIndex);
        }
      }
      tooltip!.style.opacity = "1";
      renderer.domElement.style.cursor = "pointer";
    } else {
      tooltip!.style.opacity = "0";
      hoveredLayerName = null;
      renderer.domElement.style.cursor = "grab";
    }

    composer.render();
  }

  renderer.setAnimationLoop(animate);

  // ── Disposal ──
  function disposeMaterial(m: THREE.Material) {
    const rec = m as unknown as Record<string, unknown>;
    for (const v of Object.values(rec)) {
      if (v && typeof v === "object" && (v as THREE.Texture).isTexture) {
        (v as THREE.Texture).dispose();
      }
    }
    m.dispose();
  }

  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    timer.dispose();
    ro.disconnect();
    for (const d of disposers.reverse()) {
      try {
        d();
      } catch {}
    }
    controls.dispose();
    composer.passes.forEach((p) => {
      const anyP = p as unknown as { dispose?: () => void };
      if (typeof anyP.dispose === "function") {
        try {
          anyP.dispose();
        } catch {}
      }
    });
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      const geom = (mesh as { geometry?: THREE.BufferGeometry }).geometry;
      if (geom && typeof geom.dispose === "function") geom.dispose();
      const mat = (mesh as { material?: THREE.Material | THREE.Material[] })
        .material;
      if (Array.isArray(mat)) {
        for (const m of mat) disposeMaterial(m);
      } else if (mat) {
        disposeMaterial(mat);
      }
    });
    renderer.dispose();
    if (renderer.domElement.parentNode === wrapper) {
      wrapper.removeChild(renderer.domElement);
    }
  }

  return { dispose };
}
