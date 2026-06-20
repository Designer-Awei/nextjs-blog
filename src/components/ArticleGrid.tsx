import type { ArticleSummary } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { ArticleGridHeader } from "./ArticleGridHeader";

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
 * 站酷风格作品网格
 */
export function ArticleGrid({
  articles,
  title = "最新文章",
  showViewAll = false,
  showLabel = true,
}: ArticleGridProps) {
  const showHeader = Boolean(title || showViewAll);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {showHeader && (
          <ArticleGridHeader
            title={title}
            showLabel={showLabel}
            showViewAll={showViewAll}
          />
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
