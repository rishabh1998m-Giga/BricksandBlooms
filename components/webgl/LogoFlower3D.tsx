"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PETAL_COUNT = 8;

// Approximate hues sampled from the logo mark's own flower, walking
// clockwise from the top petal — six petals in deep forest/teal greens,
// two (flanking the top petal) in a lighter olive, matching the mark's
// colour drift around the ring rather than one flat flower colour.
const PETAL_HUES = [
  "#173d2c", // top
  "#8a9b52", // upper-right (olive)
  "#1f5c48", // right
  "#1a4a35", // lower-right
  "#173d2c", // bottom
  "#3f7a52", // lower-left
  "#0f4a3a", // left
  "#8a9b52", // upper-left (olive)
];

function darken(hex: string, factor: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function buildHalfPetalGeometry() {
  // Half of a lance-shaped petal, split along its own centerline. Paired
  // with a mirrored, separately-shaded copy below, it forms one petal with
  // a visible seam down the middle — the folded-leaf look the logo mark's
  // petals have, where each half catches light differently, rather than
  // one flat almond shape in a single colour (see Flower3D for that
  // simpler version, used everywhere else on the site).
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-0.5, 0.35, -0.38, 1.2, 0, 1.65);
  shape.lineTo(0, 0);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 2,
    curveSegments: 14,
  });
}

/**
 * The flower from the Brick & Blooms logo mark, rebuilt as real 3D
 * geometry — eight lance-shaped petals (not the site's usual five-petal
 * brand flower), each split into two separately-shaded halves, cycling
 * through the same deep-green-to-olive palette as the mark. Built
 * specifically for the Performance section's two WebGL blooms, per
 * request, rather than changing Flower3D (used throughout the rest of
 * the site) itself.
 */
export default function LogoFlower3D({
  position,
  scale = 1,
  spinSpeed = 0.03,
}: {
  position: [number, number, number];
  scale?: number;
  spinSpeed?: number;
}) {
  const halfGeometry = useMemo(() => buildHalfPetalGeometry(), []);
  const petals = useMemo(
    () => PETAL_HUES.map((hue) => ({ hue, dark: darken(hue, 0.8) })),
    []
  );
  const groupRef = useRef<THREE.Group>(null);
  const bobPhase = useRef((position[0] * 1.7 + position[1] * 2.3) % (Math.PI * 2));

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.z += delta * spinSpeed;
    bobPhase.current += delta * 0.3;
    group.position.y = position[1] + Math.sin(bobPhase.current) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {petals.map(({ hue, dark }, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / PETAL_COUNT]}>
          <mesh geometry={halfGeometry}>
            <meshStandardMaterial color={hue} roughness={0.65} metalness={0} />
          </mesh>
          <mesh geometry={halfGeometry} scale={[-1, 1, 1]}>
            <meshStandardMaterial color={dark} roughness={0.65} metalness={0} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color="#f7f2e8" roughness={0.4} metalness={0.05} />
      </mesh>
    </group>
  );
}
