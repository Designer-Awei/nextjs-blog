"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { remotionInterpolate } from "@/lib/motion-curve";

interface RemotionMountFadeProps {
  /** 子元素 */
  children: ReactNode;
  /** 延迟毫秒 */
  delayMs?: number;
  /** 动画时长毫秒 */
  durationMs?: number;
  /** 额外 className */
  className?: string;
}

/**
 * 挂载入场动画 — 使用 Remotion Skill 推荐的 bezier(0.16, 1, 0.3, 1) 曲线
 */
export function RemotionMountFade({
  children,
  delayMs = 0,
  durationMs = 800,
  className = "",
}: RemotionMountFadeProps) {
  const [style, setStyle] = useState({ opacity: 0, translateY: 24 });
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setStyle({ opacity: 1, translateY: 0 });
      return;
    }

    let rafId = 0;
    const startAt = performance.now() + delayMs;

    const tick = (now: number) => {
      const elapsed = now - startAt;

      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const opacity = remotionInterpolate(elapsed, [0, durationMs], [0, 1]);
      const translateY = remotionInterpolate(elapsed, [0, durationMs], [24, 0]);

      setStyle({ opacity, translateY });

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [delayMs, durationMs]);

  return (
    <div
      className={className}
      style={{
        opacity: style.opacity,
        translate: `0 ${style.translateY}px`,
        willChange: style.opacity < 1 ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}
