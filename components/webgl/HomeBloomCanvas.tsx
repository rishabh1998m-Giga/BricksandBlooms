"use client";

import { Suspense, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Brick3D from "./Brick3D";
import Flower3D from "./Flower3D";
import { useCinematicMode } from "@/lib/useCinematicMode";

type Pointer = { x: number; y: number };
type Progress = { value: number };

// Same threshold-driven scale-in used by BrickToBloomCanvas on /services —
// duplicated rather than imported because this scene's composition (and
// its thresholds) are tuned independently for a full-bleed, symmetric
// frame instead of a frame sharing space with a bottom-left text column.
function Grow({
  threshold,
  progressRef,
  position,
  children,
}: {
  threshold: number;
  progressRef: RefObject<Progress>;
  position: [number, number, number];
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const target = progressRef.current.value >= threshold ? 1 : 0;
    const next = THREE.MathUtils.damp(group.scale.x, target, 2.1, delta);
    group.scale.setScalar(next);
  });

  return (
    <group ref={groupRef} position={position} scale={0}>
      {children}
    </group>
  );
}

function WaterPool({
  position,
  progressRef,
  threshold,
}: {
  position: [number, number, number];
  progressRef: RefObject<Progress>;
  threshold: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(position[0] * 1.4);
  const grown = useRef(0);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    phase.current += delta * 0.4;
    const target = progressRef.current.value >= threshold ? 1 : 0;
    grown.current = THREE.MathUtils.damp(grown.current, target, 2.1, delta);
    const breathe = 1 + Math.sin(phase.current) * 0.015;
    mesh.scale.set(grown.current * breathe, grown.current, grown.current * breathe);
  });

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} scale={0}>
      <circleGeometry args={[1.25, 48]} />
      <meshStandardMaterial color="#5aab93" roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

function LanternGlow({
  position,
  progressRef,
  threshold,
}: {
  position: [number, number, number];
  progressRef: RefObject<Progress>;
  threshold: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const target = progressRef.current.value >= threshold ? 1 : 0;
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        0.15 + target * 1.5,
        2,
        delta
      );
    }
    if (groupRef.current) {
      const next = THREE.MathUtils.damp(groupRef.current.scale.x, target, 2.1, delta);
      groupRef.current.scale.setScalar(next);
    }
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#f1ecdd" intensity={0.15} distance={9} />
      <group ref={groupRef} scale={0}>
        <mesh>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial
            color="#4a3a2a"
            emissive="#f1ecdd"
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial color="#f1ecdd" transparent opacity={0.2} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.44, 16, 16]} />
          <meshBasicMaterial color="#c05f38" transparent opacity={0.08} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function CameraRig({ pointer }: { pointer: RefObject<Pointer> }) {
  const { camera } = useThree();

  /* eslint-disable react-hooks/immutability -- per-frame camera parallax,
     same pattern as the rest of this site's section-scoped canvases. */
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pointer.current.x * 0.9,
      3,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.7 + pointer.current.y * 0.4,
      3,
      delta
    );
    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * The homepage's own brick-to-bloom sequence — same real geometry
 * (Brick3D, Flower3D) and the same scroll-driven growth technique as the
 * /services flagship scene, but composed to stand alone in a full-bleed
 * frame: a brick wall on the left, a path through the center, blooms and
 * water spread across the full width, and a lantern over the middle —
 * rather than one cluster pushed to one side of a text column that isn't
 * present here.
 */
export default function HomeBloomCanvas({
  sectionRef,
  progressRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  progressRef: RefObject<Progress>;
}) {
  const enabled = useCinematicMode();
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled) return;
    const handleMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.y = -((e.clientY - rect.top) / rect.height - 0.5);
    };
    section.addEventListener("pointermove", handleMove);
    return () => section.removeEventListener("pointermove", handleMove);
  }, [sectionRef, enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.7, 11], fov: 36, near: 0.1, far: 32 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#f7f2e8", 10, 26]} />
          <ambientLight intensity={0.85} color="#e8ddc8" />
          <directionalLight position={[3, 5, 4]} intensity={1.7} color="#f1ecdd" castShadow />
          <directionalLight position={[-4, 1, -1]} intensity={0.32} color="#c05f38" />
          <directionalLight position={[0, -1, 3]} intensity={0.16} color="#2b8870" />

          {/* Ground — a single slab spanning the full frame */}
          <mesh position={[0, -1.1, -1]} receiveShadow>
            <boxGeometry args={[12, 0.3, 6.5]} />
            <meshStandardMaterial color="#e8dcc5" roughness={0.95} />
          </mesh>

          {/* 01 — Structure: a brick wall anchoring the left third */}
          <Grow threshold={0.02} progressRef={progressRef} position={[-3.9, -0.5, -0.3]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, 0.12, 0]} scale={0.9} />
          </Grow>
          <Grow threshold={0.05} progressRef={progressRef} position={[-2.6, -0.5, -0.38]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, -0.08, 0]} scale={0.9} />
          </Grow>
          <Grow threshold={0.08} progressRef={progressRef} position={[-3.9, 0.26, -0.3]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, 0.12, 0]} scale={0.9} color="#8a7058" />
          </Grow>
          <Grow threshold={0.11} progressRef={progressRef} position={[-2.6, 0.26, -0.38]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, -0.08, 0]} scale={0.9} color="#8a7058" />
          </Grow>
          <Grow threshold={0.14} progressRef={progressRef} position={[-3.25, 1.02, -0.34]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, 0.04, 0]} scale={0.9} />
          </Grow>

          {/* 02 — Terrain: a path running from the wall through the center */}
          <Grow threshold={0.2} progressRef={progressRef} position={[-0.3, -1.02, 0.5]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[5.2, 1.8, 0.06]} />
              <meshStandardMaterial color="#c9ba9d" roughness={0.9} />
            </mesh>
          </Grow>

          {/* 03 — Planting: blooms spread across the full width, not just
              beside the brick, so nothing reads as empty at either edge */}
          <Grow threshold={0.3} progressRef={progressRef} position={[-2.9, -0.62, 0.65]}>
            <Flower3D position={[0, 0, 0]} color="#c97079" scale={0.26} spinSpeed={-0.02} />
          </Grow>
          <Grow threshold={0.38} progressRef={progressRef} position={[-1.1, -0.6, 0.9]}>
            <Flower3D position={[0, 0, 0]} color="#2b8870" scale={0.32} spinSpeed={0.025} />
          </Grow>
          <Grow threshold={0.46} progressRef={progressRef} position={[0.5, -0.68, 0.7]}>
            <Flower3D position={[0, 0, 0]} color="#c05f38" scale={0.3} spinSpeed={-0.022} />
          </Grow>
          <Grow threshold={0.54} progressRef={progressRef} position={[1.9, -0.64, 0.55]}>
            <Flower3D position={[0, 0, 0]} color="#2b8870" scale={0.26} spinSpeed={0.03} />
          </Grow>
          <Grow threshold={0.6} progressRef={progressRef} position={[3.3, -0.58, 0.2]}>
            <Flower3D position={[0, 0, 0]} color="#c97079" scale={0.24} spinSpeed={-0.026} />
          </Grow>

          {/* 04 — Water: a pool anchoring the right third, mirroring the
              brick wall's weight on the left. y sits just above the
              ground slab's top face (-0.95) — below it, the water mesh
              renders inside the opaque ground and never shows. */}
          <WaterPool position={[3.9, -0.94, -0.1]} progressRef={progressRef} threshold={0.68} />

          {/* 05 — Light: a lantern glow unifying the whole width */}
          <LanternGlow position={[0.2, 1.5, -0.6]} progressRef={progressRef} threshold={0.8} />

          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
