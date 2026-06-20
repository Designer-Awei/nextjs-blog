"use client";

import { useEffect, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import {
  HeroIntro,
  HERO_INTRO_DURATION,
  HERO_INTRO_HEIGHT,
  HERO_INTRO_WIDTH,
  type HeroIntroProps,
} from "@/remotion/compositions/HeroIntro";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

/** 主题配色 */
type HeroTheme = {
  foreground: string;
  muted: string;
  accent: string;
};

/** 浅色主题配色 */
const LIGHT_THEME: HeroTheme = {
  foreground: "#1d1d1f",
  muted: "#86868b",
  accent: "#0071e3",
};

/** 深色主题配色 */
const DARK_THEME: HeroTheme = {
  foreground: "#f5f5f7",
  muted: "#a1a1a6",
  accent: "#2997ff",
};

interface HeroIntroPlayerProps
  extends Pick<HeroIntroProps, "title" | "name" | "bio"> {}

/**
 * Hero 文字 Remotion Player — 打字机 + 分层淡入
 */
export function HeroIntroPlayer({ title, name, bio }: HeroIntroPlayerProps) {
  const [theme, setTheme] = useState<HeroTheme>(LIGHT_THEME);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => setTheme(media.matches ? DARK_THEME : LIGHT_THEME);

    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, []);

  return (
    <Player
      component={HeroIntro as ComponentType<Record<string, unknown>>}
      inputProps={{ title, name, bio, ...theme }}
      durationInFrames={HERO_INTRO_DURATION}
      compositionWidth={HERO_INTRO_WIDTH}
      compositionHeight={HERO_INTRO_HEIGHT}
      fps={30}
      autoPlay
      controls={false}
      style={{
        width: "100%",
        maxWidth: 768,
        height: HERO_INTRO_HEIGHT,
      }}
    />
  );
}
