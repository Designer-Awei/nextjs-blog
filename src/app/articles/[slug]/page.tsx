import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button, Tag } from "antd";
import { ArrowLeft, Clock, Eye, Heart, MessageCircle } from "react-feather";
import { ArticleContent } from "@/components/ArticleContent";
import { getAllSlugs, getArticleBySlug } from "@/lib/articles";
import { getArticleStats } from "@/lib/article-stats";
import { getAuthor } from "@/lib/author";

export const dynamic = "force-dynamic";

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
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * 动态生成文章 SEO 元数据
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "文章未找到" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

/**
 * 文章详情页 — 站酷作品详情风格
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const author = await getAuthor();

  if (!article) {
    notFound();
  }

  const stats = getArticleStats(article.slug);

  return (
    <article className="bg-surface pb-16 pt-6">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6">
        <Link href="/articles">
          <Button type="link" icon={<ArrowLeft size={14} />} className="!px-0">
            返回列表
          </Button>
        </Link>

        <header className="mt-4 overflow-hidden rounded-sm bg-background shadow-[var(--card-shadow)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="860px"
            />
            <span className="zcool-category-badge">{article.category}</span>
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-display text-foreground">{article.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-[#666]">
              {article.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-border pb-5 text-sm text-muted">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <span>{author.name}</span>
              </div>
              <span>{formatDate(article.publishedAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} 分钟
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={14} />
                {stats.views}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart size={14} />
                {stats.likes}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle size={14} />
                {stats.comments}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Tag key={tag} color="gold">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </header>

        <div className="prose-apple mt-8 rounded-sm bg-background p-6 shadow-[var(--card-shadow)] sm:p-8">
          <ArticleContent blocks={article.content} />
        </div>
      </div>
    </article>
  );
}
