"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore, SectionName } from "@/lib/sceneStore";

// ── Section poses ─────────────────────────────────────────────
// targetPosY = -1.75 ensures full body including feet is visible
// with camera at Z~6.5 and FOV 40
const SECTION_POSES: Record<SectionName, {
  targetRotY:  number;
  targetPosX:  number;
  targetPosY:  number;
  headTiltY:   number;
  headTiltX:   number;
}> = {
  hero:         { targetRotY: 0,     targetPosX: 0.8,  targetPosY: -1.75, headTiltY: 0,     headTiltX: 0     },
  about:        { targetRotY: 0.25,  targetPosX: 0.8,  targetPosY: -1.75, headTiltY: 0.15,  headTiltX: -0.06 },
  skills:       { targetRotY: -0.15, targetPosX: 0.8,  targetPosY: -1.75, headTiltY: -0.08, headTiltX: 0.05  },
  experience:   { targetRotY: 0.3,   targetPosX: 0.8,  targetPosY: -1.75, headTiltY: 0.18,  headTiltX: -0.05 },
  projects:     { targetRotY: -0.25, targetPosX: 0.8,  targetPosY: -1.75, headTiltY: -0.12, headTiltX: 0.04  },
  certificates: { targetRotY: 0.1,   targetPosX: 0.8,  targetPosY: -1.72, headTiltY: 0.05,  headTiltX: -0.1  },
  showcase:     { targetRotY: -0.3,  targetPosX: 0.8,  targetPosY: -1.75, headTiltY: -0.15, headTiltX: 0.03  },
  contact:      { targetRotY: 0.15,  targetPosX: 0.8,  targetPosY: -1.75, headTiltY: 0.08,  headTiltX: -0.04 },
  footer:       { targetRotY: 0,     targetPosX: 0.8,  targetPosY: -1.75, headTiltY: 0,     headTiltX: 0     },
};

export default function AvatarController() {
  const group  = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/avatar.glb");
  const { actions, names }    = useAnimations(animations, group);

  // Smooth refs for per-frame interpolation
  const time           = useRef(0);
  const smoothMouseX   = useRef(0);
  const smoothMouseY   = useRef(0);
  const smoothRotY     = useRef(0);
  const smoothRotX     = useRef(0);
  const smoothPosY     = useRef(-1.75);
  const smoothPosX     = useRef(0.8);
  const prevScrollY    = useRef(0);
  const scrollVelocity = useRef(0);

  // Head bone ref for independent head tracking
  const headBone       = useRef<THREE.Bone | null>(null);
  const spineBone      = useRef<THREE.Bone | null>(null);
  const smoothHeadRotX = useRef(0);
  const smoothHeadRotY = useRef(0);

  // ── Find bones for head tracking ──
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      // Common bone names from Mixamo/ReadyPlayerMe
      if ((child as THREE.Bone).isBone) {
        const name = child.name.toLowerCase();
        if (
          name.includes("head") &&
          !name.includes("top") &&
          !name.includes("end")
        ) {
          headBone.current = child as THREE.Bone;
        }
        if (
          name.includes("spine") &&
          (name.includes("1") || name.includes("2"))
        ) {
          spineBone.current = child as THREE.Bone;
        }
      }
    });

    // Enhance materials
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.roughness       = 0.35;
            mat.metalness       = 0.05;
            mat.envMapIntensity = 1.0;
            mat.needsUpdate     = true;
          }
        });
      }
    });
  }, [scene]);

  // ── Play animation ──
  useEffect(() => {
    if (!actions || names.length === 0) return;
    const firstName = names[0];
    if (firstName && actions[firstName]) {
      actions[firstName]!.reset();
      actions[firstName]!.setLoop(THREE.LoopRepeat, Infinity);
      actions[firstName]!.fadeIn(0.3);
      actions[firstName]!.play();
    }
    return () => {
      names.forEach((n) => {
        try { actions[n]?.stop(); } catch { /* ignore */ }
      });
    };
  }, [actions, names]);

  // ── Per-frame motion ──
  useFrame((_, delta) => {
    if (!group.current) return;
    time.current += delta;
    const t = time.current;

    const { mouseX, mouseY, scrollY, currentSection } = sceneStore.getState();
    const pose = SECTION_POSES[currentSection] ?? SECTION_POSES.hero;

    // ── Scroll velocity for bounce ──
    scrollVelocity.current  = (scrollY - prevScrollY.current) * 0.08;
    prevScrollY.current     = scrollY;
    scrollVelocity.current *= 0.88;

    // ── Smooth mouse (fast lerp for responsive feel) ──
    const mouseLerp = delta * 5.0;
    smoothMouseX.current += (mouseX - smoothMouseX.current) * mouseLerp;
    smoothMouseY.current += (mouseY - smoothMouseY.current) * mouseLerp;

    // ═══════════════════════════════════════════════
    // BODY ROTATION — follows mouse + section pose
    // ═══════════════════════════════════════════════

    // Y rotation: section direction + mouse left/right (stronger value)
    const bodyTargetRotY =
      pose.targetRotY +
      smoothMouseX.current * 0.4 +
      pose.headTiltY;
    smoothRotY.current += (bodyTargetRotY - smoothRotY.current) * delta * 3.0;
    group.current.rotation.y = smoothRotY.current;

    // X rotation: mouse up/down (lean forward/back subtly)
    const bodyTargetRotX =
      smoothMouseY.current * -0.1 +
      pose.headTiltX +
      Math.sin(t * 0.35) * 0.003;
    smoothRotX.current += (bodyTargetRotX - smoothRotX.current) * delta * 3.0;
    group.current.rotation.x = smoothRotX.current;

    // ═══════════════════════════════════════════════
    // HEAD BONE — independent stronger mouse follow
    // ═══════════════════════════════════════════════
    if (headBone.current) {
      // Head looks MORE toward cursor than body
      const headTargetY = smoothMouseX.current * 0.5;
      const headTargetX = smoothMouseY.current * -0.3;

      smoothHeadRotY.current += (headTargetY - smoothHeadRotY.current) * delta * 4.0;
      smoothHeadRotX.current += (headTargetX - smoothHeadRotX.current) * delta * 4.0;

      headBone.current.rotation.y = smoothHeadRotY.current;
      headBone.current.rotation.x = smoothHeadRotX.current;
    }

    // Spine subtle lean toward mouse
    if (spineBone.current) {
      spineBone.current.rotation.y = smoothMouseX.current * 0.08;
      spineBone.current.rotation.x = smoothMouseY.current * -0.04;
    }

    // ═══════════════════════════════════════════════
    // POSITION
    // ═══════════════════════════════════════════════

    // Breathing
    const breathe = Math.sin(t * 0.85) * 0.008;

    // Scroll bounce
    const scrollBounce = scrollVelocity.current * 0.04;

    // Celebrate bounce for certificates
    const celebrateBounce = currentSection === "certificates"
      ? Math.abs(Math.sin(t * 3.0)) * 0.03
      : 0;

    // Y position
    const targetY = pose.targetPosY + breathe + scrollBounce + celebrateBounce;
    smoothPosY.current += (targetY - smoothPosY.current) * delta * 6;
    group.current.position.y = smoothPosY.current;

    // X position (right side of screen)
    smoothPosX.current += (pose.targetPosX - smoothPosX.current) * delta * 1.5;
    group.current.position.x = smoothPosX.current;

    // Z stays at 0
    group.current.position.z = 0;

    // Subtle sway
    group.current.rotation.z = Math.sin(t * 0.4) * 0.004;

    // Scale — fixed, no pulsing (cleaner)
    group.current.scale.setScalar(1.55);
  });

  return (
    <group
      ref={group}
      position={[0.8, -1.75, 0]}
      rotation={[0, 0, 0]}
      scale={1.55}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/avatar.glb");