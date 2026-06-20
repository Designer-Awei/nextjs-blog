import { unstable_noStore as noStore } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import { defaultArticles } from "@/data/mock/articles";
import { validateArticle } from "@/lib/article-validation";
import type { Article, ArticleSummary } from "@/types";

const ARTICLES_FILE = path.join(process.cwd(), "data", "articles.json");

/**
 * 从 JSON 文件读取全部文章
 */
export async function getArticles(): Promise<Article[]> {
  noStore();
  try {
    const raw = await fs.readFile(ARTICLES_FILE, "utf-8");
    return JSON.parse(raw) as Article[];
  } catch {
    await saveArticles(defaultArticles);
    return defaultArticles;
  }
}

/**
 * 写入全部文章
 * @param articles - 文章数组
 */
export async function saveArticles(articles: Article[]): Promise<void> {
  await fs.mkdir(path.dirname(ARTICLES_FILE), { recursive: true });
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
}

/**
 * 获取所有文章摘要，按发布日期降序
 */
export async function getAllArticles(): Promise<ArticleSummary[]> {
  const articles = await getArticles();
  return [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map(({ content: _, ...summary }) => summary);
}

/**
 * 根据 slug 获取单篇文章
 * @param slug - 文章标识
 */
export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

/**
 * 获取所有 slug
 */
export async function getAllSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((a) => a.slug);
}

/**
 * 获取精选文章
 * @param count - 数量
 */
export async function getFeaturedArticles(
  count = 3
): Promise<ArticleSummary[]> {
  const all = await getAllArticles();
  return all.slice(0, count);
}

/**
 * 创建文章
 * @param data - 文章数据
 */
export async function createArticle(data: unknown): Promise<Article> {
  const articles = await getArticles();
  const slugs = articles.map((a) => a.slug);
  const article = validateArticle(data, slugs);
  articles.push(article);
  await saveArticles(articles);
  return article;
}

/**
 * 更新文章
 * @param slug - 原 slug
 * @param data - 新数据
 */
export async function updateArticle(
  slug: string,
  data: unknown
): Promise<Article> {
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) throw new Error("文章不存在");

  const slugs = articles.map((a) => a.slug);
  const article = validateArticle(data, slugs, slug);
  articles[index] = article;
  await saveArticles(articles);
  return article;
}

/**
 * 删除文章
 * @param slug - 文章 slug
 */
export async function deleteArticle(slug: string): Promise<void> {
  const articles = await getArticles();
  const next = articles.filter((a) => a.slug !== slug);
  if (next.length === articles.length) throw new Error("文章不存在");
  await saveArticles(next);
}
