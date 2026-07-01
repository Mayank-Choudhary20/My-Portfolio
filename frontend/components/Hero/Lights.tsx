"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PointLight } from "three";

export default function Lights() {
  const cyan = useRef<PointLight>(null);
  const purple = useRef<PointLight>(null);
  const rim = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (cyan.current) {
      cyan.current.position.x = Math.sin(t * 0.5) * 3;
      cyan.current.position.z = Math.cos(t * 0.5) * 2 + 1;
      cyan.current.intensity = 2.8 + Math.sin(t * 1.1) * 0.4;
    }
    if (purple.current) {
      purple.current.position.x =
        Math.sin(t * 0.35 + Math.PI) * 2.8;
      purple.current.position.z =
        Math.cos(t * 0.35 + Math.PI) * 2;
      purple.current.intensity = 2.2 + Math.cos(t * 0.8) * 0.4;
    }
    if (rim.current) {
      rim.current.intensity = 1.8 + Math.sin(t * 0.55) * 0.3;
    }
  });

  return (
    <>
      {/* Ambient — bright enough to see the whole avatar */}
      <ambientLight intensity={1.8} color="#ddeeff" />

      {/* Key: front-top — primary face light */}
      <directionalLight
        position={[1, 5, 6]}
        intensity={4.5}
        color="#ffffff"
      />

      {/* Secondary fill from left-front */}
      <directionalLight
        position={[-2, 3, 4]}
        intensity={2.2}
        color="#e8f4ff"
      />

      {/* Cyan orbiting fill */}
      <pointLight
        ref={cyan}
        position={[-3, 3, 3]}
        intensity={2.8}
        color="#00e5ff"
        distance={14}
        decay={2}
      />

      {/* Purple back/side */}
      <pointLight
        ref={purple}
        position={[3, 2.5, -2]}
        intensity={2.2}
        color="#7c3aed"
        distance={12}
        decay={2}
      />

      {/* Rim from above-behind */}
      <pointLight
        ref={rim}
        position={[0, 6, -3]}
        intensity={1.8}
        color="#3b82f6"
        distance={10}
        decay={2}
      />

      {/* Direct face fill at eye level */}
      <pointLight
        position={[0, 1.0, 5]}
        intensity={2.8}
        color="#ffffff"
        distance={9}
        decay={2}
      />

      {/* Ground bounce */}
      <pointLight
        position={[0, -0.5, 2.5]}
        intensity={0.9}
        color="#80d0ff"
        distance={5}
        decay={2}
      />
    </>
  );
}