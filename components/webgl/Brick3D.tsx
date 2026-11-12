"use client";

/**
 * A single brick — the site's other founding motif, alongside Flower3D.
 * Deliberately plain geometry (a box, not an extrusion): a brick is a
 * brick, and restraint here is what keeps a whole wall of them reading
 * as material rather than as clutter.
 */
export default function Brick3D({
  position,
  rotation = [0, 0, 0],
  color = "#9c7f63",
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  scale?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.85, 0.85]} />
      <meshStandardMaterial color={color} roughness={0.88} metalness={0.03} />
    </mesh>
  );
}
