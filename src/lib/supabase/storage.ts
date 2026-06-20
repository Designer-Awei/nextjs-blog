import { normalizeAvatarPath } from "@/lib/avatar-url";
import { getSupabaseEnv } from "./env";

/** 头像 Storage 桶（公开读） */
export const AVATAR_BUCKET = "avatars";

/** 默认头像对象路径 */
export const DEFAULT_AVATAR_OBJECT_PATH = "default/avatar.jpg";

/**
 * 构建 Supabase Storage 公开 URL
 * @param bucket - 桶名
 * @param objectPath - 对象路径
 */
export function getStoragePublicUrl(bucket: string, objectPath: string): string {
  const { url } = getSupabaseEnv();
  const normalizedPath = objectPath.replace(/^\/+/, "");
  return `${url}/storage/v1/object/public/${bucket}/${normalizedPath}`;
}

/**
 * 获取默认头像公开 URL
 */
export function getDefaultAvatarUrl(): string {
  return getStoragePublicUrl(AVATAR_BUCKET, DEFAULT_AVATAR_OBJECT_PATH);
}

/**
 * 判断是否为 legacy 本地头像路径
 * @param avatar - 头像路径或 URL
 */
export function isLegacyLocalAvatar(avatar: string): boolean {
  const value = avatar.trim();
  return value.startsWith("/images/") || value === "/images/avatar.jpg";
}

/**
 * 将头像路径解析为 Storage 公开 URL
 * @param avatar - 数据库存储值或 legacy 路径
 */
export function resolveAvatarUrl(avatar: string): string {
  const trimmed = avatar.trim();

  if (!trimmed || isLegacyLocalAvatar(trimmed)) {
    return getDefaultAvatarUrl();
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return normalizeAvatarPath(trimmed);
  }

  if (trimmed.startsWith("/")) {
    return getDefaultAvatarUrl();
  }

  return getStoragePublicUrl(AVATAR_BUCKET, trimmed);
}
