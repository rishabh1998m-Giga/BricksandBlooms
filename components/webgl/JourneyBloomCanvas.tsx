"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Flower3D from "./Flower3D";
import { useCinematicMode } from "@/lib/useCinematicMode";

type Pointer = { x: number; y: number };
type Progress = { value: number };

type FlowerSpec = {
  position: [number, number, number];
  color: string;
  scale: number;
  spinSpeed: number;
  threshold: number;
};

const FLOWERS: FlowerSpec[] = [
  { position: [3.3, 3.1, -2.6], color: "#4ca48e", scale: 0.32, spinSpeed: 0.03, threshold: 0.02 },
  { position: [5.1, 1.3, -3.6], color: "#d97a4e", scale: 0.42, spinSpeed: -0.022, threshold: 0.2 },
  { position: [3.6, -0.9, -2.9], color: "#dd939a", scale: 0.3, spinSpeed: 0.026, threshold: 0.4 },
  { position: [5.4, -2.5, -4.1], color: "#4ca48e", scale: 0.38, spinSpeed: -0.018, threshold: 0.6 },
  { position: [2.9, -3.7, -3.3], color: "#d97a4e", scale: 0.33, spinSpeed: 0.024, threshold: 0.8 },
];

function GrowingFlower({
  spec,
  progressRef,
}: {
  spec: FlowerSpec;
  progressRef: RefObject<Progress>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const target = progressRef.current.value >= spec.threshold ? 1 : 0;
    const next = THREE.MathUtils.damp(group.scale.x, target, 2.2, delta);
    group.scale.setScalar(next);
  });

  return (
    <group ref={groupRef} position={spec.position} scale={0}>
      <Flower3D
        position={[0, 0, 0]}
        color={spec.color}
        scale={spec.scale}
        spinSpeed={spec.spinSpeed}
      />
    </group>
  );
}

function CameraRig({ pointer }: { pointer: RefObject<Pointer> }) {
  const { camera } = useThree();

  /* eslint-disable react-hooks/immutability -- per-frame camera parallax,
     same pattern as ProofBloomCanvas's CameraRig. */
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pointer.current.x * 0.9,
      3,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      pointer.current.y * 0.6,
      3,
      delta
    );
    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * Five real 3D flowers, scattered through the depth of the journey stage,
 * that grow into being as the scroll-driven trail passes each waypoint —
 * the section's emptiest region (behind and around the content column)
 * filled with an object that's part of the same narrative, not a
 * decorative afterthought.
 */
export default function JourneyBloomCanvas({
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
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0e0c09", 9, 23]} />
          <ambientLight intensity={0.22} color="#3a362c" />
          <directionalLight position={[3, 4, 5]} intensity={1.4} color="#f1ecdd" />
          <directionalLight position={[-4, 1, 2]} intensity={0.4} color="#d97a4e" />
          <directionalLight position={[0, -2, 3]} intensity={0.18} color="#4ca48e" />
          {FLOWERS.map((spec, i) => (
            <GrowingFlower key={i} spec={spec} progressRef={progressRef} />
          ))}
          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
