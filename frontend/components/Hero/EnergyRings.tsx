"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Torus } from "@react-three/drei";
import { Mesh } from "three";

export default function EnergyRings() {
  const ring1 = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  const ring3 = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.5;
      ring1.current.rotation.z = t * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.4;
      ring2.current.rotation.y = t * 0.5;
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.6;
      ring3.current.rotation.z = -t * 0.4;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Outer ring — cyan */}
      <Torus
        ref={ring1}
        args={[2.5, 0.008, 16, 200]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2}
          transparent
          opacity={0.35}
        />
      </Torus>

      {/* Middle ring — blue */}
      <Torus
        ref={ring2}
        args={[2.0, 0.006, 16, 200]}
      >
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={2}
          transparent
          opacity={0.3}
        />
      </Torus>

      {/* Inner ring — purple */}
      <Torus
        ref={ring3}
        args={[1.5, 0.005, 16, 200]}
      >
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </Torus>
    </group>
  );
}