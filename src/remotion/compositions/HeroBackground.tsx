import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const LOOP_FRAMES = 180;

interface OrbProps {
  /** 水平位置百分比 */
  left: string;
  /** 垂直位置百分比 */
  top: string;
  /** 尺寸 px */
  size: number;
  /** 颜色 */
  color: string;
  /** 动画相位偏移 */
  phase: number;
}

/**
 * 单个浮动光晕球体
 */
function FloatingOrb({ left, top, size, color, phase }: OrbProps) {
  const frame = useCurrentFrame();
  const loopFrame = (frame + phase) % LOOP_FRAMES;

  const driftX = interpolate(
    loopFrame,
    [0, LOOP_FRAMES / 2, LOOP_FRAMES],
    [-18, 22, -18],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  const driftY = interpolate(
    loopFrame,
    [0, LOOP_FRAMES / 3, (LOOP_FRAMES * 2) / 3, LOOP_FRAMES],
    [0, -28, 16, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  const scale = interpolate(
    loopFrame,
    [0, LOOP_FRAMES / 2, LOOP_FRAMES],
    [1, 1.12, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const opacity = interpolate(
    loopFrame,
    [0, LOOP_FRAMES / 2, LOOP_FRAMES],
    [0.35, 0.55, 0.35],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(64px)",
        opacity,
        scale,
        translate: `${driftX}px ${driftY}px`,
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * Hero 背景 — 循环渐变光晕，遵循 Remotion interpolate 动画规范
 */
export function HeroBackground() {
  const frame = useCurrentFrame();

  const vignetteOpacity = interpolate(
    frame % LOOP_FRAMES,
    [0, LOOP_FRAMES / 2, LOOP_FRAMES],
    [0.08, 0.14, 0.08],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(0, 113, 227, 0.06) 0%, transparent 55%)",
        overflow: "hidden",
      }}
    >
      <FloatingOrb
        left="12%"
        top="18%"
        size={320}
        color="rgba(0, 113, 227, 0.22)"
        phase={0}
      />
      <FloatingOrb
        left="68%"
        top="8%"
        size={280}
        color="rgba(41, 151, 255, 0.18)"
        phase={45}
      />
      <FloatingOrb
        left="52%"
        top="58%"
        size={360}
        color="rgba(0, 113, 227, 0.12)"
        phase={90}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, ${vignetteOpacity}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
}
