import Link from "next/link";
import type { ArticleSummary } from "@/types";
import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
  /** 文章列表 */
  articles: ArticleSummary[];
  /** 区块标题，为空时不渲染标题区域 */
  title?: string;
  /** 是否显示「查看全部」链接 */
  showViewAll?: boolean;
  /** 是否显示区块标签 */
  showLabel?: boolean;
}

/**
 * 文章网格列表
 */
export function ArticleGrid({
  articles,
  title = "最新文章",
  showViewAll = false,
  showLabel = true,
}: ArticleGridProps) {
  const showHeader = title || showViewAll;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        {showHeader && (
          <div className="mb-12 flex items-end justify-between">
            <div>
              {showLabel && title && (
                <p className="mb-2 text-sm font-medium text-accent">Blog</p>
              )}
              {title && (
                <h2 className="text-display text-foreground">{title}</h2>
              )}
            </div>
            {showViewAll && (
              <Link
                href="/articles"
                className="text-sm text-accent transition-colors hover:text-accent-hover"
              >
                查看全部 →
              </Link>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
