"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Brick3D from "./Brick3D";
import Flower3D from "./Flower3D";
import { useCinematicMode } from "@/lib/useCinematicMode";

type Pointer = { x: number; y: number };

function WaterSurface({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(position[0] * 1.3);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    phase.current += delta * 0.4;
    // A slow, barely-perceptible breathing scale — the only concession to
    // "water movement" this scene needs; a real ripple shader would cost
    // more than the moment is worth.
    const s = 1 + Math.sin(phase.current) * 0.015;
    mesh.scale.set(s, 1, s);
  });

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.1, 48]} />
      <meshStandardMaterial color="#5aab93" roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

function DustMotes({ count = 26 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic scatter (seeded by index) rather than Math.random()
      // at render time, keeping this a pure render.
      const a = i * 12.9898;
      const b = i * 78.233;
      const rx = (Math.sin(a) * 43758.5453) % 1;
      const ry = (Math.sin(b) * 12543.789) % 1;
      arr[i * 3] = rx * 10 - 5;
      arr[i * 3 + 1] = ry * 6 - 2;
      arr[i * 3 + 2] = ((rx + ry) % 1) * 6 - 5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c05f38" size={0.02} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function CameraRig({ pointer }: { pointer: RefObject<Pointer> }) {
  const { camera } = useThree();

  // Mutating the three.js camera inside useFrame is the correct, documented
  // R3F pattern for per-frame updates — see HeroCameraScene's CameraRig.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 1.3, 3, delta);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      1.1 + pointer.current.y * 0.6,
      3,
      delta
    );
    camera.lookAt(0, 0.2, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * The entry moment — a small, complete piece of terrain rendered in real
 * 3D: ground, brick, bloom, water, light. Not a hero video, not a stock
 * illustration — an actual composed scene that answers "a digital
 * landscape" literally, at a scale and restraint that reads as art
 * direction rather than a game level.
 */
export default function LandscapeOpeningCanvas({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
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
        camera={{ position: [0, 1.1, 8.5], fov: 32, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#f7f2e8", 7, 20]} />
          <ambientLight intensity={0.85} color="#e8ddc8" />
          <directionalLight position={[3, 5, 4]} intensity={1.8} color="#f1ecdd" castShadow />
          <directionalLight position={[-4, 1, -1]} intensity={0.35} color="#c05f38" />
          <directionalLight position={[0, -1, 3]} intensity={0.16} color="#2b8870" />

          {/* Ground */}
          <mesh position={[0, -1.1, -1]} receiveShadow>
            <boxGeometry args={[9, 0.3, 6]} />
            <meshStandardMaterial color="#e8dcc5" roughness={0.95} />
          </mesh>

          {/* A low brick course anchoring the left */}
          <Brick3D position={[-2.6, -0.5, -0.4]} rotation={[0, 0.15, 0]} scale={0.9} />
          <Brick3D position={[-1.35, -0.5, -0.5]} rotation={[0, -0.08, 0]} scale={0.9} />
          <Brick3D position={[-2.6, 0.24, -0.4]} rotation={[0, 0.15, 0]} scale={0.9} color="#8a7058" />

          {/* Blooms taking root beside it */}
          <Flower3D position={[-0.2, -0.6, 0.6]} color="#2b8870" scale={0.3} spinSpeed={0.02} />
          <Flower3D position={[0.6, -0.75, 1.1]} color="#c97079" scale={0.22} spinSpeed={-0.024} />

          {/* Water, to the right */}
          <WaterSurface position={[2.4, -0.94, 0.2]} />

          <DustMotes />
          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
