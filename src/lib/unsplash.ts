/**
 * 构建 Unsplash 图片 URL
 * @param photoId - Unsplash 图片 ID（不含 photo- 前缀）
 * @param width - 输出宽度
 */
export function unsplashUrl(photoId: string, width = 800): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

/** 博客默认 Unsplash 素材 */
export const UNSPLASH = {
  hero: unsplashUrl("1558655146-d09347e92766", 1920),
  covers: {
    nextjs: unsplashUrl("1498050108023-c5249f4df085", 800),
    design: unsplashUrl("1561070791-2526d30994b5", 800),
    typescript: unsplashUrl("1516116216624-53e697fedbea", 800),
    blog: unsplashUrl("1486312338219-ce68d2c6f44d", 800),
    about: unsplashUrl("1522202176988-66273c2fd55f", 1200),
  },
} as const;
