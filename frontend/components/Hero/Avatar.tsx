"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Group, LoopRepeat, MeshStandardMaterial, Object3D } from "three";

interface AvatarProps {
  mouseX?: number;
  mouseY?: number;
  scrollY?: number;
}

function AvatarInner({ mouseX = 0, mouseY = 0, scrollY = 0 }: AvatarProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF("/avatar.glb");
  const { actions, names } = useAnimations(animations, group);

  // Smooth refs — no state, no re-renders
  const time = useRef(0);
  const smoothMouseX = useRef(0);
  const smoothMouseY = useRef(0);
  const smoothRotY = useRef(0);
  const smoothPosY = useRef(-1.35);
  const prevScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  // ── Enhance materials ──────────────────────────────────────
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((m) => {
          const mat = m as MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.roughness = 0.4;
            mat.metalness = 0.05;
            mat.envMapIntensity = 1.0;
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [scene]);

  // ── Play Mixamo animation ──────────────────────────────────
  useEffect(() => {
    if (!actions || names.length === 0) return;

    // Log available names for debugging
    console.log("Avatar animation names:", names);

    // Play first available animation (Mixamo GLBs usually have one)
    const firstName = names[0];
    if (firstName && actions[firstName]) {
      const action = actions[firstName];
      action!.reset();
      action!.setLoop(LoopRepeat, Infinity);
      action!.fadeIn(0.3);
      action!.play();
    }

    return () => {
      names.forEach((n) => {
        try {
          actions[n]?.stop();
        } catch {
          /* ignore */
        }
      });
    };
  }, [actions, names]);

  // ── Per-frame procedural motion ───────────────────────────
  useFrame((_, delta) => {
    if (!group.current) return;

    time.current += delta;
    const t = time.current;

    // Track scroll velocity for bounce effect
    const currentScroll = scrollY;
    scrollVelocity.current =
      (currentScroll - prevScrollY.current) * 0.1;
    prevScrollY.current = currentScroll;
    scrollVelocity.current *= 0.85; // dampen

    // ── 1. Smooth mouse follow ──
    const lerpSpeed = delta * 3.5;
    smoothMouseX.current +=
      (mouseX - smoothMouseX.current) * lerpSpeed;
    smoothMouseY.current +=
      (mouseY - smoothMouseY.current) * lerpSpeed;

    // ── 2. Y rotation: face forward + mouse look ──
    // Avatar faces camera at Y=0 (front)
    // Mouse shifts rotation left/right slightly
    const targetRotY = smoothMouseX.current * 0.3;
    smoothRotY.current +=
      (targetRotY - smoothRotY.current) * delta * 3;
    group.current.rotation.y = smoothRotY.current;

    // ── 3. X tilt from mouse Y (look up/down) ──
    const tiltX = smoothMouseY.current * -0.08;
    group.current.rotation.x =
      tiltX + Math.sin(t * 0.35) * 0.004;

    // ── 4. Breathing bob ──
    const breathe = Math.sin(t * 0.85) * 0.011;

    // ── 5. Scroll bounce ──
    const scrollBounce = scrollVelocity.current * 0.06;

    // ── 6. Smooth position Y ──
    const targetY = -1.35 + breathe + scrollBounce;
    smoothPosY.current +=
      (targetY - smoothPosY.current) * delta * 8;
    group.current.position.y = smoothPosY.current;

    // ── 7. Subtle sway ──
    group.current.rotation.z = Math.sin(t * 0.45) * 0.006;

    // ── 8. Gentle scale pulse ──
    const pulse = 1 + Math.sin(t * 1.1) * 0.002;
    group.current.scale.setScalar(1.25 * pulse);
  });

  return (
    // rotation.y = 0 means the avatar faces the camera directly
    // (Mixamo avatars exported from ReadyPlayerMe/Mixamo face +Z by default)
    <group
      ref={group}
      position={[0, -1.35, 0]}
      rotation={[0, 0, 0]}
      scale={1.25}
    >
      <primitive object={scene} />
    </group>
  );
}

export default function Avatar(props: AvatarProps) {
  return <AvatarInner {...props} />;
}

useGLTF.preload("/avatar.glb");