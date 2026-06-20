"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { remotionInterpolate } from "@/lib/motion-curve";

interface ScrollRevealProps {
  /** 子元素 */
  children: ReactNode;
  /** 额外 className */
  className?: string;
  /** 动画时长毫秒 */
  durationMs?: number;
  /** 进入视口后的延迟毫秒 */
  delayMs?: number;
  /** 垂直位移 px */
  distance?: number;
}

/**
 * 滚动进入视口时的 Remotion 风格 reveal 动画
 */
export function ScrollReveal({
  children,
  className = "",
  durationMs = 700,
  delayMs = 0,
  distance = 20,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({ opacity: 0, translateY: distance });

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setStyle({ opacity: 1, translateY: 0 });
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [distance]);

  useEffect(() => {
    if (!visible) {
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
      const translateY = remotionInterpolate(
        elapsed,
        [0, durationMs],
        [distance, 0],
      );

      setStyle({ opacity, translateY });

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible, delayMs, durationMs, distance]);

  return (
    <div
      ref={ref}
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
