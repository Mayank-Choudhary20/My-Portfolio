"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-4, 3, 3]}
        intensity={2}
        color="#00E5FF"
      />

      <pointLight
        position={[4, 3, -3]}
        intensity={2}
        color="#7C3AED"
      />

      <spotLight
        position={[0, 6, 5]}
        angle={0.3}
        penumbra={1}
        intensity={3}
      />
    </>
  );
}