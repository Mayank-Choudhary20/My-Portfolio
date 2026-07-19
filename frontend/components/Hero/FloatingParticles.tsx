"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";

export default function FloatingParticles() {

  const particles = useMemo(() => {

    const arr = [];

    for (let i = 0; i < 2500; i++) {

      arr.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

    }

    return new Float32Array(arr);

  }, []);

  return (
    <Points positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#00E5FF"
        size={0.03}
        depthWrite={false}
      />
    </Points>
  );
}