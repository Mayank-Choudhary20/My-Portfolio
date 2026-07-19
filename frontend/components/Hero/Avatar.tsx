"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

export default function Avatar() {
  const group = useRef<Group>(null);

  const { scene, animations } = useGLTF("/avatar.glb");

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;

    const names = Object.keys(actions);

    if (names.length > 0) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group
      ref={group}
      position={[0, -1.4, 0]}
      rotation={[0, Math.PI, 0]}
      scale={1.25}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/avatar.glb");