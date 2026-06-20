"use client";

import dynamic from "next/dynamic";
import { HeroBackground } from "@/remotion/compositions/HeroBackground";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

/**
 * Hero 背景 Remotion Player — 循环播放光晕动画
 */
export function HeroBackgroundPlayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <Player
        component={HeroBackground}
        durationInFrames={180}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        loop
        autoPlay
        controls={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
