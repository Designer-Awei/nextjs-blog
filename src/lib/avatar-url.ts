/**
 * 规范化头像路径，移除 query 参数
 * @param avatar - 原始头像 URL
 */
export function normalizeAvatarPath(avatar: string): string {
  return avatar.split("?")[0];
}

/**
 * 构建带缓存戳的头像 URL（供 img 标签使用）
 * @param avatar - 头像路径
 * @param updatedAt - 更新时间戳
 */
export function buildAvatarSrc(avatar: string, updatedAt?: number): string {
  const path = normalizeAvatarPath(avatar);
  if (!path || path.endsWith(".svg")) return path;
  if (!updatedAt) return path;
  return `${path}?v=${updatedAt}`;
}
