import type { Article, ArticleBlock } from "@/types";

/** slug 合法字符 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 将标题转为 URL slug
 * @param title - 文章标题
 */
export function slugify(title: string): string {
  let slug = title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    slug = `article-${Date.now().toString(36)}`;
  }

  return slug.slice(0, 60);
}

/**
 * 根据正文估算阅读时长（分钟）
 * @param content - 内容块数组
 */
export function estimateReadTime(content: ArticleBlock[]): number {
  const text = content.map((b) => b.text).join("");
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / 400));
}

/**
 * 校验单个内容块
 * @param block - 待校验内容块
 */
function validateBlock(block: unknown): ArticleBlock | null {
  if (!block || typeof block !== "object") return null;
  const raw = block as Record<string, unknown>;
  const type = raw.type;
  const text = String(raw.text ?? "").trim();

  if (!text) return null;

  switch (type) {
    case "heading":
    case "paragraph":
    case "quote":
      return { type, text };
    case "code":
      return {
        type: "code",
        text,
        language: raw.language ? String(raw.language).trim() : undefined,
      };
    default:
      return null;
  }
}

/**
 * 校验并规范化文章数据
 * @param data - 待校验原始数据
 * @param existingSlugs - 已有 slug 列表（用于唯一性校验）
 * @param originalSlug - 编辑时的原 slug
 */
export function validateArticle(
  data: unknown,
  existingSlugs: string[] = [],
  originalSlug?: string
): Article {
  if (!data || typeof data !== "object") {
    throw new Error("无效的文章数据");
  }

  const raw = data as Record<string, unknown>;

  const slug = String(raw.slug ?? "").trim();
  const title = String(raw.title ?? "").trim();
  const excerpt = String(raw.excerpt ?? "").trim();
  const category = String(raw.category ?? "").trim();
  const publishedAt = String(raw.publishedAt ?? "").trim();

  if (!title) throw new Error("标题不能为空");
  if (!excerpt) throw new Error("摘要不能为空");
  if (!category) throw new Error("分类不能为空");
  if (!slug) throw new Error("Slug 不能为空");
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("Slug 仅允许小写字母、数字和连字符");
  }

  const taken = existingSlugs.filter((s) => s !== originalSlug);
  if (taken.includes(slug)) {
    throw new Error("Slug 已存在，请更换");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    throw new Error("发布日期格式应为 YYYY-MM-DD");
  }

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map(String).map((t) => t.trim()).filter(Boolean)
    : String(raw.tags ?? "")
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean);

  const contentRaw = Array.isArray(raw.content) ? raw.content : [];
  const content = contentRaw
    .map(validateBlock)
    .filter((b): b is ArticleBlock => b !== null);

  if (content.length === 0) {
    throw new Error("正文至少需要一段有效内容");
  }

  const readTime =
    typeof raw.readTime === "number" && raw.readTime > 0
      ? Math.round(raw.readTime)
      : estimateReadTime(content);

  return {
    slug,
    title,
    excerpt,
    coverImage: String(raw.coverImage ?? "/covers/default.svg").trim(),
    category,
    publishedAt,
    readTime,
    tags,
    content,
  };
}

/**
 * 创建空白文章模板
 */
export function createEmptyArticle(): Article {
  const today = new Date().toISOString().slice(0, 10);
  return {
    slug: "",
    title: "",
    excerpt: "",
    coverImage: "/covers/default.svg",
    category: "随笔",
    publishedAt: today,
    readTime: 1,
    tags: [],
    content: [{ type: "paragraph", text: "" }],
  };
}
