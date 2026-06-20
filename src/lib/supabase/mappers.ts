import type { ArticleBlock, ArticleStatus } from "@/types";

/** 数据库文章行 */
interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  category: string;
  published_at: string | null;
  read_time: number;
  tags: string[];
  status: ArticleStatus;
}

/** 数据库内容块行 */
interface ArticleBlockRow {
  id: string;
  article_id: string;
  sort_order: number;
  type: ArticleBlock["type"];
  text: string;
  language: string | null;
}

/**
 * 将内容块行转为应用类型
 * @param row - 数据库行
 */
export function mapBlockRow(row: ArticleBlockRow): ArticleBlock {
  if (row.type === "code") {
    return {
      type: "code",
      text: row.text,
      language: row.language ?? undefined,
    };
  }

  return { type: row.type, text: row.text };
}

/**
 * 将文章行与内容块组装为 Article
 */
export function mapArticleRow(
  row: ArticleRow,
  blocks: ArticleBlockRow[],
): import("@/types").Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    category: row.category,
    publishedAt: row.published_at ?? new Date().toISOString().slice(0, 10),
    readTime: row.read_time,
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status,
    content: blocks
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapBlockRow),
  };
}

/**
 * 将内容块转为数据库插入格式
 * @param articleId - 文章 ID
 * @param blocks - 内容块数组
 */
export function mapBlocksToInsert(
  articleId: string,
  blocks: ArticleBlock[],
): Omit<ArticleBlockRow, "id" | "created_at">[] {
  return blocks.map((block, index) => ({
    article_id: articleId,
    sort_order: index,
    type: block.type,
    text: block.text,
    language: block.type === "code" ? (block.language ?? null) : null,
  }));
}

export type { ArticleRow, ArticleBlockRow };
