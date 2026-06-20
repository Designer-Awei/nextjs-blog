import Link from "next/link";
import type { ArticleSummary } from "@/types";

interface ArticleCardProps {
  /** 文章摘要数据 */
  article: ArticleSummary;
}

/**
 * 格式化发布日期为中文 locale
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
 * 文章卡片 — Apple 风格简洁卡片
 */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-2xl bg-surface p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* 封面色块 */}
      <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5">
        <span className="text-3xl font-semibold text-accent/30">
          {article.category.charAt(0)}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-3 text-xs text-muted">
        <span>{article.category}</span>
        <span>·</span>
        <span>{formatDate(article.publishedAt)}</span>
        <span>·</span>
        <span>{article.readTime} 分钟阅读</span>
      </div>

      <h3 className="text-headline text-foreground transition-colors group-hover:text-accent">
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {article.excerpt}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
