import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import {
  getAllSlugs,
  getArticleBySlug,
} from "@/lib/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 格式化发布日期
 * @param dateStr - ISO 日期字符串
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 预生成所有文章静态页面
 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/**
 * 动态生成文章 SEO 元数据
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "文章未找到" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

/**
 * 文章详情页
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* 返回链接 */}
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center text-sm text-accent transition-colors hover:text-accent-hover"
        >
          ← 返回文章列表
        </Link>

        {/* 文章头部 */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-xs text-muted">
            <span>{article.category}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readTime} 分钟阅读</span>
          </div>

          <h1 className="text-display text-foreground">{article.title}</h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* 封面装饰 */}
        <div className="mb-12 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5">
          <span className="text-5xl font-semibold text-accent/25">
            {article.category}
          </span>
        </div>

        {/* 正文 */}
        <ArticleContent blocks={article.content} />
      </div>
    </article>
  );
}
