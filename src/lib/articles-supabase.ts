import { unstable_noStore as noStore } from "next/cache";
import {
  mapArticleRow,
  mapBlocksToInsert,
  type ArticleBlockRow,
  type ArticleRow,
} from "@/lib/supabase/mappers";
import { createSupabaseReadClient } from "@/lib/supabase/read";
import {
  validateArticle,
  type ArticleSaveMode,
} from "@/lib/article-validation";
import type { Article, ArticleStatus, ArticleSummary } from "@/types";

/**
 * 获取 Supabase 客户端
 */
function getSupabase() {
  return createSupabaseReadClient();
}

/**
 * 获取全部 slug
 */
export async function getAllSlugs(): Promise<string[]> {
  noStore();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published");

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.slug);
}

/**
 * 查询文章及内容块
 * @param slug - 文章 slug
 * @param options - 查询选项
 */
async function fetchArticleBySlug(
  slug: string,
  options: { includeDraft?: boolean } = {},
): Promise<Article | undefined> {
  noStore();
  const supabase = getSupabase();

  let query = supabase.from("articles").select("*").eq("slug", slug);

  if (!options.includeDraft) {
    query = query.eq("status", "published");
  }

  const { data: articleRow, error } = await query.maybeSingle();

  if (error) throw new Error(error.message);
  if (!articleRow) return undefined;

  const { data: blockRows, error: blockError } = await supabase
    .from("article_blocks")
    .select("*")
    .eq("article_id", articleRow.id)
    .order("sort_order", { ascending: true });

  if (blockError) throw new Error(blockError.message);

  return mapArticleRow(
    articleRow as ArticleRow,
    (blockRows ?? []) as ArticleBlockRow[],
  );
}

/**
 * 根据 slug 获取已发布文章
 * @param slug - 文章 slug
 */
export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  return fetchArticleBySlug(slug);
}

/**
 * 管理端获取文章（含草稿）
 * @param slug - 文章 slug
 */
export async function getArticleBySlugForManage(
  slug: string,
): Promise<Article | undefined> {
  return fetchArticleBySlug(slug, { includeDraft: true });
}

/**
 * 将文章行转为摘要
 */
function toSummary(row: ArticleRow): ArticleSummary {
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
  };
}

/**
 * 获取文章列表
 * @param options - 是否包含草稿
 */
async function fetchArticles(options: {
  includeDraft?: boolean;
}): Promise<ArticleRow[]> {
  noStore();
  const supabase = getSupabase();

  let query = supabase.from("articles").select("*");

  if (!options.includeDraft) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query.order("published_at", {
    ascending: false,
    nullsFirst: false,
  });

  if (error) throw new Error(error.message);
  return (data ?? []) as ArticleRow[];
}

/**
 * 获取全部文章（管理端，含正文）
 */
export async function getArticles(): Promise<Article[]> {
  const rows = await fetchArticles({ includeDraft: true });
  const supabase = getSupabase();
  const results: Article[] = [];

  for (const row of rows) {
    const { data: blockRows, error } = await supabase
      .from("article_blocks")
      .select("*")
      .eq("article_id", row.id)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);

    results.push(
      mapArticleRow(row, (blockRows ?? []) as ArticleBlockRow[]),
    );
  }

  return results;
}

/**
 * 获取全部文章摘要
 * @param includeDraft - 是否包含草稿
 */
export async function getAllArticles(
  includeDraft = false,
): Promise<ArticleSummary[]> {
  const rows = await fetchArticles({ includeDraft });
  return rows.map(toSummary);
}

/**
 * 获取精选已发布文章
 * @param count - 数量
 */
export async function getFeaturedArticles(
  count = 3,
): Promise<ArticleSummary[]> {
  const all = await getAllArticles(false);
  return all.slice(0, count);
}

/**
 * 写入文章内容块
 * @param articleId - 文章 ID
 * @param blocks - 内容块
 */
async function replaceArticleBlocks(
  articleId: string,
  blocks: Article["content"],
): Promise<void> {
  const supabase = getSupabase();

  const { error: deleteError } = await supabase
    .from("article_blocks")
    .delete()
    .eq("article_id", articleId);

  if (deleteError) throw new Error(deleteError.message);

  if (blocks.length === 0) return;

  const { error: insertError } = await supabase
    .from("article_blocks")
    .insert(mapBlocksToInsert(articleId, blocks));

  if (insertError) throw new Error(insertError.message);
}

/**
 * 创建文章
 * @param data - 原始数据
 * @param status - 发布状态
 * @param mode - 校验模式
 */
export async function createArticle(
  data: unknown,
  status: ArticleStatus = "draft",
  mode: ArticleSaveMode = status === "published" ? "publish" : "draft",
): Promise<Article> {
  const supabase = getSupabase();
  const { data: existing } = await supabase.from("articles").select("slug");
  const slugs = (existing ?? []).map((row) => row.slug);

  const article = validateArticle(data, slugs, undefined, mode);

  const { data: inserted, error } = await supabase
    .from("articles")
    .insert({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      category: article.category,
      published_at: article.publishedAt,
      read_time: article.readTime,
      tags: article.tags,
      status,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await replaceArticleBlocks(inserted.id, article.content);

  const { data: blockRows } = await supabase
    .from("article_blocks")
    .select("*")
    .eq("article_id", inserted.id)
    .order("sort_order", { ascending: true });

  return mapArticleRow(
    inserted as ArticleRow,
    (blockRows ?? []) as ArticleBlockRow[],
  );
}

/**
 * 更新文章
 * @param slug - 原 slug
 * @param data - 新数据
 * @param status - 发布状态
 * @param mode - 校验模式
 */
export async function updateArticle(
  slug: string,
  data: unknown,
  status?: ArticleStatus,
  mode: ArticleSaveMode = status === "published" ? "publish" : "draft",
): Promise<Article> {
  const supabase = getSupabase();

  const { data: current, error: findError } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (findError) throw new Error(findError.message);
  if (!current) throw new Error("文章不存在");

  const { data: existing } = await supabase.from("articles").select("slug");
  const slugs = (existing ?? []).map((row) => row.slug);

  const article = validateArticle(data, slugs, slug, mode);
  const nextStatus = status ?? (current as ArticleRow).status;

  const { data: updated, error } = await supabase
    .from("articles")
    .update({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      category: article.category,
      published_at: article.publishedAt,
      read_time: article.readTime,
      tags: article.tags,
      status: nextStatus,
    })
    .eq("id", current.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await replaceArticleBlocks(updated.id, article.content);

  const { data: blockRows } = await supabase
    .from("article_blocks")
    .select("*")
    .eq("article_id", updated.id)
    .order("sort_order", { ascending: true });

  return mapArticleRow(updated as ArticleRow, (blockRows ?? []) as ArticleBlockRow[]);
}

/**
 * 删除文章
 * @param slug - 文章 slug
 */
export async function deleteArticle(slug: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("articles").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}
