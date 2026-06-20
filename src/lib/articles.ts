import { articles } from "@/data/mock/articles";
import type { Article, ArticleSummary } from "@/types";

/**
 * 获取所有文章摘要，按发布日期降序排列
 * @returns 文章摘要列表
 */
export function getAllArticles(): ArticleSummary[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * 根据 slug 获取单篇文章
 * @param slug - 文章 URL 标识
 * @returns 文章详情，未找到时返回 undefined
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/**
 * 获取所有文章 slug，用于静态生成
 * @returns slug 数组
 */
export function getAllSlugs(): string[] {
  return articles.map((article) => article.slug);
}

/**
 * 获取精选文章（首页展示）
 * @param count - 返回数量，默认 3
 * @returns 精选文章摘要列表
 */
export function getFeaturedArticles(count = 3): ArticleSummary[] {
  return getAllArticles().slice(0, count);
}
