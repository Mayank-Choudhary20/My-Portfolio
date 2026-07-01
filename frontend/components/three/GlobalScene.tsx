"use client";

import dynamic from "next/dynamic";

const GlobalSceneInner = dynamic(
  () => import("./GlobalSceneInner"),
  { ssr: false }
);

export default function GlobalScene() {
  return <GlobalSceneInner />;
}