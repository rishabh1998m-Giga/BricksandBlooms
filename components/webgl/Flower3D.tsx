"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PETAL_COUNT = 5;

function buildPetalGeometry() {
  // A single petal, base at the origin so five copies fan out from one
  // shared center when rotated — an almond silhouette tapering to a
  // point at both ends, not a generic ellipse.
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-0.55, 0.25, -0.42, 1.1, 0, 1.5);
  shape.bezierCurveTo(0.42, 1.1, 0.55, 0.25, 0, 0);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 3,
    curveSegments: 16,
  });
}

/**
 * The brand's flower motif (first drawn flat in FlowerBud.tsx) rebuilt as
 * real geometry — extruded petals with a matte material catching actual
 * light, not a decorative floating primitive.
 */
export default function Flower3D({
  position,
  color,
  scale = 1,
  spinSpeed = 0.03,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  spinSpeed?: number;
}) {
  const petalGeometry = useMemo(() => buildPetalGeometry(), []);
  const groupRef = useRef<THREE.Group>(null);
  // Derived from position rather than Math.random() so it stays a pure,
  // deterministic render — the two flowers still land on different
  // phases since their positions differ.
  const bobPhase = useRef((position[0] * 1.7 + position[1] * 2.3) % (Math.PI * 2));

  // Idle ambient motion — a slow spin-in-plane plus a gentle vertical bob.
  // Restrained on purpose: luxury motion is slow motion.
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.z += delta * spinSpeed;
    bobPhase.current += delta * 0.3;
    group.position.y = position[1] + Math.sin(bobPhase.current) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {Array.from({ length: PETAL_COUNT }).map((_, i) => (
        <mesh
          key={i}
          geometry={petalGeometry}
          rotation={[0, 0, (i * Math.PI * 2) / PETAL_COUNT]}
        >
          <meshStandardMaterial color={color} roughness={0.78} metalness={0} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.06]}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.08} />
      </mesh>
    </group>
  );
}
