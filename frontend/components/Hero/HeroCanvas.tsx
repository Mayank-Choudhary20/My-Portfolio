"use client";

import {
  Suspense,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";

import Avatar from "./Avatar";
import Lights from "./Lights";
import FloatingParticles from "./FloatingParticles";
import EnergyRings from "./EnergyRings";

interface HeroCanvasProps {
  scrollY?: number;
  section?: string;
}

function LoadingPlaceholder() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.4, 1.4, 0.25]} />
      <meshStandardMaterial
        color="#1e3a5f"
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

function ProfileFallback() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: "#020617" }}
    >
      <div className="relative">
        <div
          className="absolute -inset-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.jpg"
          alt="Mayank Choudhary"
          className="relative w-56 h-56 rounded-full object-cover"
          style={{
            border: "3px solid rgba(0,229,255,0.3)",
            boxShadow: "0 0 40px rgba(0,229,255,0.2)",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <p className="mt-4 text-xs text-slate-600 font-mono">3D Avatar</p>
    </div>
  );
}

export default function HeroCanvas({
  scrollY = 0,
  section = "hero",
}: HeroCanvasProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [contextLost, setContextLost] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const lostCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      // Use window-level mouse for wider tracking area
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -((e.clientY / window.innerHeight) - 0.5) * 2;
      setMouseX(Math.max(-1, Math.min(1, nx)));
      setMouseY(Math.max(-1, Math.min(1, ny)));
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () =>
      window.removeEventListener("mousemove", handleMouse);
  }, []);

  const handleContextLost = useCallback(() => {
    lostCountRef.current += 1;
    setContextLost(true);
    if (lostCountRef.current >= 3) setWebglFailed(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
  }, []);

  const handleRestore = useCallback(() => {
    setContextLost(false);
    setCanvasKey((k) => k + 1);
  }, []);

  if (webglFailed) return <ProfileFallback />;

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ background: "#020617" }}
    >
      {contextLost && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
          style={{ background: "#020617" }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <p className="text-xs text-slate-600 font-mono">
            Restoring 3D…
          </p>
          <button
            onClick={handleRestore}
            className="text-[10px] text-cyan-500/60 hover:text-cyan-400 transition-colors"
          >
            tap to reload
          </button>
        </div>
      )}

      <Canvas
        key={canvasKey}
        shadows={false}
        dpr={[1, 1.5]}
        camera={{
          // Position camera in front of avatar at eye level
          position: [0, 0.5, 3.8],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "default",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#020617"), 1);
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              handleContextLost();
            }
          );
          gl.domElement.addEventListener(
            "webglcontextrestored",
            handleContextRestored
          );
        }}
      >
        <color attach="background" args={["#020617"]} />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Lights />

        <Suspense fallback={null}>
          <FloatingParticles />
        </Suspense>

        <Suspense fallback={null}>
          <EnergyRings />
        </Suspense>

        <Suspense fallback={<LoadingPlaceholder />}>
          <Avatar
            mouseX={mouseX}
            mouseY={mouseY}
            scrollY={scrollY}
          />
        </Suspense>

        <ContactShadows
          position={[0, -1.36, 0]}
          opacity={0.45}
          blur={2.5}
          scale={8}
          far={3}
          color="#000020"
        />

        <gridHelper
          args={[18, 24, "#0a2040", "#0a1530"]}
          position={[0, -1.36, 0]}
        />

        <Preload all />
      </Canvas>
    </div>
  );
}

// Need THREE for setClearColor
import * as THREE from "three";