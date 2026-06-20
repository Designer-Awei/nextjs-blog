import { unstable_noStore as noStore } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import { defaultAuthor } from "@/data/mock/author";
import { normalizeAvatarPath } from "@/lib/avatar-url";
import type { Author } from "@/types";

const AUTHOR_FILE = path.join(process.cwd(), "data", "author.json");
const AVATAR_DIR = path.join(process.cwd(), "public", "images");
const AVATAR_FILE = path.join(AVATAR_DIR, "avatar.jpg");

/**
 * 从 JSON 文件读取作者信息，文件不存在时返回默认 mock 数据
 * @returns 作者个人信息
 */
export async function getAuthor(): Promise<Author> {
  noStore();
  try {
    const raw = await fs.readFile(AUTHOR_FILE, "utf-8");
    return JSON.parse(raw) as Author;
  } catch {
    return defaultAuthor;
  }
}

/**
 * 校验并规范化作者数据
 * @param data - 待校验的原始数据
 * @returns 规范化后的作者对象
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
    typeof raw.avatarUpdatedAt === "number"
      ? raw.avatarUpdatedAt
      : undefined;

  return {
    name,
    title,
    bio,
    avatar: normalizeAvatarPath(
      String(raw.avatar ?? defaultAuthor.avatar).trim()
    ),
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
 * 将作者信息写入 JSON 文件
 * @param author - 作者个人信息
 */
export async function saveAuthor(author: Author): Promise<void> {
  await fs.mkdir(path.dirname(AUTHOR_FILE), { recursive: true });
  await fs.writeFile(AUTHOR_FILE, JSON.stringify(author, null, 2), "utf-8");
}

/**
 * 保存头像图片并更新作者 avatar 字段
 * @param buffer - 裁剪后的图片二进制数据
 * @returns 头像路径与更新时间戳
 */
export async function saveAvatarAndUpdateAuthor(
  buffer: Buffer
): Promise<{ avatar: string; updatedAt: number }> {
  await fs.mkdir(AVATAR_DIR, { recursive: true });
  await fs.writeFile(AVATAR_FILE, buffer);

  const author = await getAuthor();
  const avatarPath = "/images/avatar.jpg";
  const updatedAt = Date.now();
  await saveAuthor({ ...author, avatar: avatarPath, avatarUpdatedAt: updatedAt });

  return { avatar: avatarPath, updatedAt };
}
