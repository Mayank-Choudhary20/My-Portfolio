"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  ContactShadows,
  AdaptiveDpr,
} from "@react-three/drei";

import Avatar from "./Avatar";
import Lights from "./Lights";
import HeroEnvironment from "./Environment";
import FloatingParticles from "./FloatingParticles";

export default function HeroCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, 1.5, 3.8],
        fov: 35,
      }}
    >
      <color attach="background" args={["#020617"]} />

      <AdaptiveDpr pixelated />

      <HeroEnvironment />

      <Lights />

      <FloatingParticles />

      <Float
        speed={2}
        rotationIntensity={0.15}
        floatIntensity={0.35}
      >
        <Avatar />
      </Float>

      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.45}
        blur={2.5}
        scale={6}
        far={3}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}