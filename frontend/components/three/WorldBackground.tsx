"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Neural Network Lines ──────────────────────────────────────
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, lines } = useMemo(() => {
    const count = 40;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 4
      ));
    }

    const linePoints: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const d = nodes[i].distanceTo(nodes[j]);
        if (d < 5) {
          linePoints.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }

    return { nodes, lines: new Float32Array(linePoints) };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.015;
    groupRef.current.rotation.x = Math.sin(t * 0.01) * 0.05;
  });

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(lines, 3));
    return geo;
  }, [lines]);

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#0a2040" transparent opacity={0.3} />
      </lineSegments>

      {/* Node spheres */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#00e5ff" : i % 3 === 1 ? "#3b82f6" : "#7c3aed"}
            emissive={i % 3 === 0 ? "#00e5ff" : i % 3 === 1 ? "#3b82f6" : "#7c3aed"}
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Holographic Floating Panels ───────────────────────────────
function HolographicPanel({
  position,
  rotation,
  size,
  color,
  delay,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  color: string;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.15;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.05 + Math.abs(Math.sin(t * 0.3)) * 0.08;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

// ── Circuit Pattern Plane ─────────────────────────────────────
function CircuitPlane() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.1 + Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
  });

  return (
    <mesh ref={ref} position={[0, -4, -6]} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[30, 20, 30, 20]} />
      <meshStandardMaterial
        color="#050a18"
        emissive="#003366"
        emissiveIntensity={0.1}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ── Energy Beams ──────────────────────────────────────────────
function EnergyBeam({
  start,
  end,
  color,
  delay,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const { geo, length } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const length = s.distanceTo(e);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const dir = e.clone().sub(s).normalize();
    const geo = new THREE.CylinderGeometry(0.003, 0.003, length, 6);
    return { geo, length, mid, dir };
  }, [start, end]);

  const mid = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    return s.clone().add(e).multiplyScalar(0.5);
  }, [start, end]);

  const quaternion = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = e.clone().sub(s).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return q;
  }, [start, end]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + delay;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = Math.max(0, Math.sin(t * 0.8) * 0.3);
    mat.emissiveIntensity = 1 + Math.sin(t * 1.2) * 0.5;
  });

  return (
    <mesh ref={ref} geometry={geo} position={mid} quaternion={quaternion}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

// ── Main World Background ─────────────────────────────────────
export default function WorldBackground() {
  return (
    <group>
      <NeuralNetwork />
      <CircuitPlane />

      {/* Holographic panels */}
      <HolographicPanel position={[-5, 1, -3]}  rotation={[0, 0.5, 0]}  size={[2.5, 1.8]} color="#00e5ff" delay={0} />
      <HolographicPanel position={[5, 0, -4]}   rotation={[0, -0.4, 0]} size={[3, 2]}     color="#7c3aed" delay={1.5} />
      <HolographicPanel position={[-4, -1, -5]} rotation={[0, 0.3, 0]}  size={[2, 1.5]}   color="#3b82f6" delay={3} />
      <HolographicPanel position={[4, 2, -3]}   rotation={[0, -0.6, 0]} size={[1.8, 1.2]} color="#ec4899" delay={2} />

      {/* Energy beams */}
      <EnergyBeam start={[-8, -2, -5]} end={[-5, 3, -3]}  color="#00e5ff" delay={0} />
      <EnergyBeam start={[6, -2, -6]}  end={[4, 2, -3]}   color="#7c3aed" delay={1} />
      <EnergyBeam start={[-3, 4, -4]}  end={[3, -1, -5]}  color="#3b82f6" delay={2} />
      <EnergyBeam start={[0, -3, -6]}  end={[0, 4, -4]}   color="#ec4899" delay={0.5} />
    </group>
  );
}