import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Hero 入场动画 props */
export type HeroIntroProps = {
  title: string;
  name: string;
  bio: string;
  /** 主文字色 */
  foreground?: string;
  /** 次要文字色 */
  muted?: string;
  /** 强调色 */
  accent?: string;
};

const DEFAULT_ACCENT = "#0071e3";
const DEFAULT_FOREGROUND = "#1d1d1f";
const DEFAULT_MUTED = "#86868b";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;

/**
 * 根据帧数计算打字机已显示字符
 * @param frame - 当前帧
 * @param fullText - 完整文本
 * @param startFrame - 开始帧
 * @param charFrames - 每字符帧数
 */
function getTypedText(
  frame: number,
  fullText: string,
  startFrame: number,
  charFrames: number,
): string {
  const localFrame = Math.max(0, frame - startFrame);
  const typedChars = Math.min(
    fullText.length,
    Math.floor(localFrame / charFrames),
  );
  return fullText.slice(0, typedChars);
}

interface CursorProps {
  /** 当前帧 */
  frame: number;
  /** 光标颜色 */
  color: string;
}

/**
 * 打字机闪烁光标
 */
function Cursor({ frame, color }: CursorProps) {
  const opacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <span style={{ color, opacity, marginLeft: 2 }}>|</span>
  );
}

interface FadeLineProps {
  /** 子内容 */
  children: React.ReactNode;
  /** 开始帧 */
  from: number;
  /** 持续帧数 */
  duration: number;
  /** 字号 */
  fontSize: number;
  /** 字重 */
  fontWeight: number;
  /** 颜色 */
  color: string;
  /** 行高 */
  lineHeight?: number;
  /** 最大宽度 */
  maxWidth?: number;
}

/**
 * 单行 fade-up 入场
 */
function FadeLine({
  children,
  from,
  duration,
  fontSize,
  fontWeight,
  color,
  lineHeight = 1.2,
  maxWidth,
}: FadeLineProps) {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const translateY = interpolate(frame, [from, from + duration], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        translate: `0 ${translateY}px`,
        fontSize,
        fontWeight,
        color,
        lineHeight,
        maxWidth,
        margin: "0 auto",
        fontFamily:
          'var(--font-inter, Inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Hero 文字入场 — 标题淡入 + 姓名打字机 + 简介淡入
 * 遵循 Remotion Skill：interpolate + Easing.bezier + 字符串 slice 打字机
 */
export function HeroIntro({
  title,
  name,
  bio,
  foreground = DEFAULT_FOREGROUND,
  muted = DEFAULT_MUTED,
  accent = DEFAULT_ACCENT,
}: HeroIntroProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFrom = 0;
  const titleDuration = Math.round(0.6 * fps);
  const nameStart = titleFrom + Math.round(0.35 * fps);
  const nameDuration = name.length * CHAR_FRAMES + Math.round(0.4 * fps);
  const bioStart = nameStart + nameDuration;
  const bioDuration = Math.round(0.7 * fps);

  const typedName = getTypedText(frame, name, nameStart, CHAR_FRAMES);
  const isTyping = typedName.length < name.length;

  const nameOpacity = interpolate(
    frame,
    [nameStart, nameStart + Math.round(0.25 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 768,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <FadeLine
          from={titleFrom}
          duration={titleDuration}
          fontSize={14}
          fontWeight={500}
          color={accent}
        >
          {title}
        </FadeLine>

        <div
          style={{
            opacity: nameOpacity,
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: foreground,
            fontFamily:
              'var(--font-inter, Inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <span>{typedName}</span>
          {isTyping ? <Cursor frame={frame} color={accent} /> : null}
        </div>

        <FadeLine
          from={bioStart}
          duration={bioDuration}
          fontSize={18}
          fontWeight={400}
          color={muted}
          lineHeight={1.6}
          maxWidth={576}
        >
          {bio}
        </FadeLine>
      </div>
    </AbsoluteFill>
  );
}

/** HeroIntro 合成总帧数 */
export const HERO_INTRO_DURATION = 120;

/** HeroIntro 合成尺寸 */
export const HERO_INTRO_WIDTH = 960;
export const HERO_INTRO_HEIGHT = 420;
