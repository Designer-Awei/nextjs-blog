/**
 * Remotion Skill 推荐的 Apple 风格入场曲线
 * 对应 Easing.bezier(0.16, 1, 0.3, 1)
 */
export const REMOTION_ENTER_BEZIER = [0.16, 1, 0.3, 1] as const;

/**
 * 三次贝塞尔缓动函数
 * @param t - 归一化进度 0–1
 */
export function cubicBezier(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const clamped = Math.max(0, Math.min(1, t));
  let start = 0;
  let end = 1;

  for (let i = 0; i < 12; i += 1) {
    const mid = (start + end) / 2;
    const x =
      3 * (1 - mid) * (1 - mid) * mid * x1 +
      3 * (1 - mid) * mid * mid * x2 +
      mid * mid * mid;

    if (x < clamped) {
      start = mid;
    } else {
      end = mid;
    }
  }

  const mid = (start + end) / 2;
  return (
    3 * (1 - mid) * (1 - mid) * mid * y1 +
    3 * (1 - mid) * mid * mid * y2 +
    mid * mid * mid
  );
}

/**
 * Remotion 风格 clamp 插值
 */
export function remotionInterpolate(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const progress = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  const eased = cubicBezier(
    progress,
    REMOTION_ENTER_BEZIER[0],
    REMOTION_ENTER_BEZIER[1],
    REMOTION_ENTER_BEZIER[2],
    REMOTION_ENTER_BEZIER[3],
  );

  return outMin + (outMax - outMin) * eased;
}
