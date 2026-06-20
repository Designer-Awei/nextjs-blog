import { getDefaultAvatarUrl } from "@/lib/supabase/storage";

/**
 * 规范化头像 URL，移除 query 参数
 * @param avatar - 原始头像 URL
 */
export function normalizeAvatarPath(avatar: string): string {
  return avatar.split("?")[0];
}

/**
 * 构建带缓存戳的头像 URL（供 img / Image 使用）
 * @param avatar - 头像 URL
 * @param updatedAt - 更新时间戳
 */
export function buildAvatarSrc(avatar: string, updatedAt?: number): string {
  const path = normalizeAvatarPath(avatar) || getDefaultAvatarUrl();
  if (path.endsWith(".svg")) return path;
  if (!updatedAt) return path;
  return `${path}?v=${updatedAt}`;
}

/**
 * 判断头像 URL 是否可用于 next/image 远程加载
 * @param avatar - 头像 URL
 */
export function isRemoteAvatarUrl(avatar: string): boolean {
  return avatar.startsWith("http://") || avatar.startsWith("https://");
}
