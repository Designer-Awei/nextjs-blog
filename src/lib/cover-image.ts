import { UNSPLASH } from "@/lib/unsplash";

/**
 * 解析文章封面 URL，空值时使用默认占位图
 * @param coverImage - 封面 URL
 */
export function resolveCoverImage(coverImage: string): string {
  const trimmed = coverImage.trim();
  return trimmed || UNSPLASH.covers.blog;
}

/**
 * 封面 URL 是否可用于 next/image
 * @param coverImage - 封面 URL
 */
export function isValidCoverImage(coverImage: string): boolean {
  return coverImage.trim().length > 0;
}
