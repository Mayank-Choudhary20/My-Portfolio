"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  ContactShadows,
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { sceneStore } from "@/lib/sceneStore";
import AvatarController from "./AvatarController";
import WorldBackground from "./WorldBackground";

// ── Cinematic Camera ──────────────────────────────────────────
function CinematicCamera() {
  const { camera } = useThree();
  const time = useRef(0);
  const targetPos = useRef(new THREE.Vector3(0, 0.3, 6.5));
  const currentPos = useRef(new THREE.Vector3(0, 0.3, 6.5));
  const targetLook = useRef(new THREE.Vector3(0, 0.2, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;

    const { mouseX, mouseY, currentSection } = sceneStore.getState();

    // Camera positions per section — pulled back (Z ~6–7)
    // Look target centered around avatar mid-body
    const sectionCameras: Record<string, {
      pos: [number, number, number];
      look: [number, number, number];
    }> = {
      hero:         { pos: [0,     0.3,  6.5],  look: [0,     0.2,  0] },
      about:        { pos: [-0.4,  0.4,  6.2],  look: [-0.2,  0.2,  0] },
      skills:       { pos: [0.3,   0.2,  6.4],  look: [0.15,  0.1,  0] },
      experience:   { pos: [-0.3,  0.35, 6.3],  look: [-0.1,  0.2,  0] },
      projects:     { pos: [0.4,   0.25, 6.2],  look: [0.2,   0.1,  0] },
      certificates: { pos: [0,     0.5,  6.6],  look: [0,     0.3,  0] },
      showcase:     { pos: [0.2,   0.3,  6.4],  look: [0.1,   0.15, 0] },
      contact:      { pos: [-0.2,  0.25, 6.5],  look: [-0.1,  0.15, 0] },
      footer:       { pos: [0,     0.2,  7.0],  look: [0,     0.1,  0] },
    };

    const cam = sectionCameras[currentSection] ?? sectionCameras.hero;

    // Floating + breathing motion
    const floatX = Math.sin(t * 0.3) * 0.06 + Math.cos(t * 0.17) * 0.03;
    const floatY = Math.sin(t * 0.25) * 0.04 + Math.cos(t * 0.4) * 0.02;
    const floatZ = Math.sin(t * 0.2) * 0.04;

    // Mouse parallax — subtle camera shift
    const parallaxX = mouseX * 0.15;
    const parallaxY = mouseY * 0.1;

    targetPos.current.set(
      cam.pos[0] + floatX + parallaxX,
      cam.pos[1] + floatY + parallaxY,
      cam.pos[2] + floatZ
    );
    targetLook.current.set(
      cam.look[0] + parallaxX * 0.2,
      cam.look[1] + parallaxY * 0.15,
      cam.look[2]
    );

    // Smooth lerp
    const lerpSpeed = delta * 1.2;
    currentPos.current.lerp(targetPos.current, lerpSpeed);
    currentLook.current.lerp(targetLook.current, lerpSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}

// ── Scene Lighting ────────────────────────────────────────────
function SceneLights() {
  const cyan   = useRef<THREE.PointLight>(null);
  const purple = useRef<THREE.PointLight>(null);
  const rim    = useRef<THREE.PointLight>(null);
  const fill   = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cyan.current) {
      cyan.current.position.x = Math.sin(t * 0.4) * 3.5;
      cyan.current.position.z = Math.cos(t * 0.4) * 2.5 + 1;
      cyan.current.intensity  = 2.5 + Math.sin(t * 1.1) * 0.5;
    }
    if (purple.current) {
      purple.current.position.x = Math.sin(t * 0.28 + Math.PI) * 3;
      purple.current.position.z = Math.cos(t * 0.28 + Math.PI) * 2;
      purple.current.intensity  = 2.0 + Math.cos(t * 0.7) * 0.4;
    }
    if (rim.current)  { rim.current.intensity  = 1.6 + Math.sin(t * 0.5) * 0.3; }
    if (fill.current) { fill.current.intensity = 2.5 + Math.sin(t * 0.9) * 0.3; }
  });

  return (
    <>
      <ambientLight intensity={1.6} color="#ddeeff" />
      <directionalLight position={[1, 5, 6]}   intensity={4.0} color="#ffffff" />
      <directionalLight position={[-2, 3, 4]}  intensity={2.0} color="#e8f4ff" />
      <pointLight ref={cyan}   position={[-3, 3, 3]}     intensity={2.5} color="#00e5ff" distance={14} decay={2} />
      <pointLight ref={purple} position={[3, 2.5, -2]}   intensity={2.0} color="#7c3aed" distance={12} decay={2} />
      <pointLight ref={rim}    position={[0, 6, -3]}     intensity={1.6} color="#3b82f6" distance={10} decay={2} />
      <pointLight ref={fill}   position={[0, 1.0, 5]}    intensity={2.5} color="#ffffff" distance={9}  decay={2} />
      <pointLight              position={[0, -0.5, 2.5]} intensity={0.8} color="#80d0ff" distance={5}  decay={2} />
    </>
  );
}

// ── Floating Particles ────────────────────────────────────────
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const palette = [
      [0, 0.9, 1],
      [0.23, 0.51, 0.96],
      [0.49, 0.23, 0.93],
      [1, 1, 1],
    ];
    for (let i = 0; i < count; i++) {
      const i3    = i * 3;
      const r     = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 1;
      positions[i3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = c[0]; colors[i3 + 1] = c[1]; colors[i3 + 2] = c[2];
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent vertexColors size={0.022} sizeAttenuation depthWrite={false} opacity={0.65} />
    </Points>
  );
}

// ── Energy Rings ──────────────────────────────────────────────
function EnergyRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const r4 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) { r1.current.rotation.x = t * 0.5;  r1.current.rotation.z = t * 0.3;  }
    if (r2.current) { r2.current.rotation.x = -t * 0.4; r2.current.rotation.y = t * 0.5;  }
    if (r3.current) { r3.current.rotation.y = t * 0.6;  r3.current.rotation.z = -t * 0.4; }
    if (r4.current) { r4.current.rotation.x = t * 0.2;  r4.current.rotation.y = -t * 0.35;}
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={r1}>
        <torusGeometry args={[3.2, 0.007, 16, 200]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.5} transparent opacity={0.3} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.5, 0.005, 16, 200]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2.5} transparent opacity={0.28} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[1.9, 0.004, 16, 200]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2.5} transparent opacity={0.35} />
      </mesh>
      <mesh ref={r4}>
        <torusGeometry args={[4.0, 0.003, 16, 200]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ── Digital Floor ─────────────────────────────────────────────
function DigitalFloor() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.4 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
  });

  return (
    <group position={[0, -1.8, 0]}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial
          color="#050a18"
          emissive="#0a1530"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
      <gridHelper args={[24, 32, "#0a2040", "#0a1530"]} />
    </group>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function GlobalSceneInner() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#020617",
      }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 6.5], fov: 40, near: 0.1, far: 120 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "default",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ width: "100%", height: "100%" }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#020617"), 1);
        }}
      >
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 14, 35]} />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <CinematicCamera />
        <SceneLights />

        <Suspense fallback={null}>
          <WorldBackground />
        </Suspense>

        <Suspense fallback={null}>
          <FloatingParticles />
        </Suspense>

        <Suspense fallback={null}>
          <EnergyRings />
        </Suspense>

        <Suspense fallback={null}>
          <AvatarController />
        </Suspense>

        <ContactShadows
          position={[0, -1.78, 0]}
          opacity={0.4}
          blur={2.5}
          scale={10}
          far={4}
          color="#000020"
        />

        <DigitalFloor />
        <Preload all />
      </Canvas>
    </div>
  );
}