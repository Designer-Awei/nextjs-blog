import { unstable_noStore as noStore } from "next/cache";
import { defaultAuthor } from "@/data/mock/author";
import { normalizeAvatarPath } from "@/lib/avatar-url";
import { createSupabaseReadClient } from "@/lib/supabase/read";
import {
  AVATAR_BUCKET,
  DEFAULT_AVATAR_OBJECT_PATH,
  getStoragePublicUrl,
  resolveAvatarUrl,
} from "@/lib/supabase/storage";
import type { Author } from "@/types";

/** 数据库作者行 */
interface AuthorRow {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  avatar_updated_at: number | null;
  location: string;
  email: string;
  social: Author["social"];
  skills: string[];
}

/**
 * 获取 Supabase 客户端
 */
function getSupabase() {
  return createSupabaseReadClient();
}

/**
 * 将数据库行转为 Author
 * @param row - 作者行
 */
function mapAuthorRow(row: AuthorRow): Author {
  return {
    name: row.name,
    title: row.title,
    bio: row.bio,
    avatar: resolveAvatarUrl(row.avatar_url),
    ...(row.avatar_updated_at != null
      ? { avatarUpdatedAt: row.avatar_updated_at }
      : {}),
    location: row.location,
    email: row.email,
    social: row.social ?? {},
    skills: Array.isArray(row.skills) ? row.skills : [],
  };
}

/**
 * 获取作者信息
 */
export async function getAuthor(): Promise<Author> {
  noStore();
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    return {
      ...defaultAuthor,
      avatar: resolveAvatarUrl(defaultAuthor.avatar),
    };
  }

  return mapAuthorRow(data as AuthorRow);
}

/**
 * 校验并规范化作者数据
 * @param data - 待校验的原始数据
 */
export function validateAuthor(data: unknown): Author {
  if (!data || typeof data !== "object") {
    throw new Error("无效的作者数据");
  }

  const raw = data as Record<string, unknown>;

  const name = String(raw.name ?? "").trim();
  const title = String(raw.title ?? "").trim();
  const bio = String(raw.bio ?? "").trim();

  if (!name || !title || !bio) {
    throw new Error("姓名、职位和简介不能为空");
  }

  const socialRaw =
    raw.social && typeof raw.social === "object"
      ? (raw.social as Record<string, unknown>)
      : {};

  const skills = Array.isArray(raw.skills)
    ? raw.skills.map(String).filter(Boolean)
    : [];

  const avatarUpdatedAt =
    typeof raw.avatarUpdatedAt === "number" ? raw.avatarUpdatedAt : undefined;

  return {
    name,
    title,
    bio,
    avatar: resolveAvatarUrl(String(raw.avatar ?? "").trim()),
    ...(avatarUpdatedAt !== undefined ? { avatarUpdatedAt } : {}),
    location: String(raw.location ?? "").trim(),
    email: String(raw.email ?? "").trim(),
    social: {
      github: socialRaw.github ? String(socialRaw.github).trim() : undefined,
      twitter: socialRaw.twitter ? String(socialRaw.twitter).trim() : undefined,
      linkedin: socialRaw.linkedin
        ? String(socialRaw.linkedin).trim()
        : undefined,
      xiaohongshu: socialRaw.xiaohongshu
        ? String(socialRaw.xiaohongshu).trim()
        : undefined,
    },
    skills,
  };
}

/**
 * 保存作者信息
 * @param author - 作者个人信息
 */
export async function saveAuthor(author: Author): Promise<void> {
  const supabase = getSupabase();
  const existing = await supabase
    .from("authors")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing.error) throw new Error(existing.error.message);

  const payload = {
    name: author.name,
    title: author.title,
    bio: author.bio,
    avatar_url: normalizeAvatarPath(resolveAvatarUrl(author.avatar)),
    avatar_updated_at: author.avatarUpdatedAt ?? null,
    location: author.location,
    email: author.email,
    social: author.social,
    skills: author.skills,
  };

  if (existing.data?.id) {
    const { error } = await supabase
      .from("authors")
      .update(payload)
      .eq("id", existing.data.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("authors").insert(payload);
  if (error) throw new Error(error.message);
}

/**
 * 保存头像 URL 并更新作者记录
 * @param avatarUrl - Storage 公开 URL
 * @returns 头像 URL 与时间戳
 */
export async function saveAvatarUrl(
  avatarUrl: string,
): Promise<{ avatar: string; updatedAt: number }> {
  const author = await getAuthor();
  const updatedAt = Date.now();
  const avatar = normalizeAvatarPath(avatarUrl);

  await saveAuthor({
    ...author,
    avatar,
    avatarUpdatedAt: updatedAt,
  });

  return { avatar, updatedAt };
}

/**
 * 上传头像到 Supabase Storage 公开桶，并写入 authors.avatar_url
 * @param buffer - 图片二进制
 * @param contentType - MIME 类型
 */
export async function uploadAvatar(
  buffer: Buffer,
  contentType: string,
): Promise<{ avatar: string; updatedAt: number }> {
  const supabase = getSupabase();
  const ext =
    contentType === "image/png"
      ? "png"
      : contentType === "image/webp"
        ? "webp"
        : "jpg";
  const objectPath =
    ext === "jpg"
      ? DEFAULT_AVATAR_OBJECT_PATH
      : `default/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(objectPath, buffer, {
      contentType,
      upsert: true,
      cacheControl: "60",
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: uploaded, error: verifyError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list("default", { search: objectPath.split("/").pop() });

  if (verifyError) throw new Error(verifyError.message);
  if (!uploaded?.length) {
    throw new Error("头像上传后未在 Storage 中找到，请检查 avatars 桶权限");
  }

  const avatarUrl = getStoragePublicUrl(AVATAR_BUCKET, objectPath);
  return saveAvatarUrl(avatarUrl);
}
