import Image from "next/image";
import Link from "next/link";
import { Tag } from "antd";
import { Eye, Heart, MessageCircle, Clock } from "react-feather";
import type { ArticleSummary } from "@/types";
import { getArticleStats } from "@/lib/article-stats";
import { getAuthor } from "@/lib/author";

interface ArticleCardProps {
  /** 文章摘要数据 */
  article: ArticleSummary;
}

/**
 * 格式化发布日期
 * @param dateStr - ISO 日期字符串
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

/**
 * 站酷风格作品卡片 — Unsplash 封面 + 互动数据
 */
export async function ArticleCard({ article }: ArticleCardProps) {
  const author = await getAuthor();
  const stats = getArticleStats(article.slug);

  return (
    <Link href={`/articles/${article.slug}`} className="zcool-work-card group block">
      <div className="zcool-work-cover">
        <span className="zcool-category-badge">{article.category}</span>
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-headline text-foreground transition-colors group-hover:text-accent-text group-hover:[text-shadow:0_0_0_#222]">
          {article.title}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-surface">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
              sizes="24px"
            />
          </div>
          <span className="text-xs text-muted">{author.name}</span>
          <span className="text-xs text-border">|</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Clock size={12} />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Eye size={13} />
            {stats.views}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart size={13} />
            {stats.likes}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={13} />
            {stats.comments}
          </span>
          <span>{article.readTime} 分钟</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} variant="filled" className="!m-0 !text-[11px]">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
