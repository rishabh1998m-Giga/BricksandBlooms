"use client";

import {
  Suspense,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Brick3D from "./Brick3D";
import Flower3D from "./Flower3D";
import { useCinematicMode } from "@/lib/useCinematicMode";

type Pointer = { x: number; y: number };
type Progress = { value: number };

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

function LightPulse({
  progressRef,
  threshold,
  base,
  boost,
}: {
  progressRef: RefObject<Progress>;
  threshold: number;
  base: number;
  boost: number;
}) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const light = ref.current;
    if (!light) return;
    const target = progressRef.current.value >= threshold ? base + boost : base;
    light.intensity = THREE.MathUtils.damp(light.intensity, target, 2, delta);
  });

  return (
    <pointLight ref={ref} position={[1.6, 1.4, 1.2]} color="#f1ecdd" intensity={base} distance={8} />
  );
}

function WaterRipple({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(position[0] * 1.7);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    phase.current += delta * 0.5;
    const s = 1 + Math.sin(phase.current) * 0.02;
    mesh.scale.set(s, 1, s);
  });

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.3, 48]} />
      <meshStandardMaterial color="#0e2a26" roughness={0.1} metalness={0.55} />
    </mesh>
  );
}

function CameraRig({ pointer }: { pointer: RefObject<Pointer> }) {
  const { camera } = useThree();

  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.8, 3, delta);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.6 + pointer.current.y * 0.4,
      3,
      delta
    );
    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * The signature sequence: a bare slab of ground assembles itself into a
 * complete landscape as you scroll — structure, terrain, planting, water,
 * light, life — one continuous 3D scene, not six illustrations swapped
 * out. Driven by a shared progress ref the parent's ScrollTrigger writes
 * to every frame (same technique as the rest of this site's scroll-linked
 * WebGL), so this component owns no scroll logic of its own.
 */
export default function BrickToBloomCanvas({
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
        camera={{ position: [0, 0.6, 8], fov: 30, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0e0c09", 8, 22]} />
          <ambientLight intensity={0.18} color="#3a362c" />
          <directionalLight position={[3, 4, 4]} intensity={1.2} color="#f1ecdd" />
          <directionalLight position={[-4, 1, -1]} intensity={0.3} color="#d97a4e" />
          <LightPulse progressRef={progressRef} threshold={0.76} base={0.15} boost={1.3} />

          {/* Ground — present from the start; everything else grows from it */}
          <mesh position={[0, -1.1, -1]} receiveShadow>
            <boxGeometry args={[8.5, 0.3, 6]} />
            <meshStandardMaterial color="#17140f" roughness={0.95} />
          </mesh>

          {/* 01 — Structure: a brick course assembling itself */}
          <Grow threshold={0.03} progressRef={progressRef} position={[-2.2, -0.5, -0.3]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, 0.12, 0]} scale={0.85} />
          </Grow>
          <Grow threshold={0.07} progressRef={progressRef} position={[-1, -0.5, -0.35]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, -0.06, 0]} scale={0.85} />
          </Grow>
          <Grow threshold={0.11} progressRef={progressRef} position={[-2.2, 0.24, -0.3]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, 0.12, 0]} scale={0.85} color="#8a7058" />
          </Grow>
          <Grow threshold={0.15} progressRef={progressRef} position={[-1, 0.24, -0.35]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, -0.06, 0]} scale={0.85} color="#8a7058" />
          </Grow>
          <Grow threshold={0.19} progressRef={progressRef} position={[-1.6, 0.98, -0.32]}>
            <Brick3D position={[0, 0, 0]} rotation={[0, 0.03, 0]} scale={0.85} />
          </Grow>

          {/* 02 — Terrain: the ground extends into a path */}
          <Grow threshold={0.28} progressRef={progressRef} position={[0.6, -1.02, 0.6]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[3.2, 1.6, 0.06]} />
              <meshStandardMaterial color="#2a251c" roughness={0.9} />
            </mesh>
          </Grow>

          {/* 03 — Planting: blooms take root */}
          <Grow threshold={0.4} progressRef={progressRef} position={[-0.1, -0.6, 0.5]}>
            <Flower3D position={[0, 0, 0]} color="#4ca48e" scale={0.32} spinSpeed={0.025} />
          </Grow>
          <Grow threshold={0.46} progressRef={progressRef} position={[-2.6, 0.7, 0.1]}>
            <Flower3D position={[0, 0, 0]} color="#dd939a" scale={0.24} spinSpeed={-0.02} />
          </Grow>
          <Grow threshold={0.52} progressRef={progressRef} position={[0.55, -0.75, 1]}>
            <Flower3D position={[0, 0, 0]} color="#4ca48e" scale={0.22} spinSpeed={0.03} />
          </Grow>

          {/* 04 — Water */}
          <Grow threshold={0.6} progressRef={progressRef} position={[2.3, -0.94, 0.3]}>
            <WaterRipple position={[0, 0, 0]} />
          </Grow>

          {/* 05 — Light: a lantern warms the whole scene (LightPulse above) */}
          <Grow threshold={0.76} progressRef={progressRef} position={[1.6, 1.4, 1.2]}>
            <mesh>
              <sphereGeometry args={[0.09, 14, 14]} />
              <meshStandardMaterial
                color="#221a12"
                emissive="#f1ecdd"
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
            {/* Soft halo — two oversized transparent shells standing in for a
                bloom pass, cheap enough to keep the scene lightweight. */}
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color="#f1ecdd" transparent opacity={0.22} toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshBasicMaterial color="#d97a4e" transparent opacity={0.08} toneMapped={false} />
            </mesh>
          </Grow>

          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
