import type { Metadata } from "next";
import Link from "next/link";
import { Button, Tag } from "antd";
import { ArticleGrid } from "@/components/ArticleGrid";
import { getAllArticles } from "@/lib/articles";
import { getAuthor } from "@/lib/author";

export const metadata: Metadata = {
  title: "文章",
  description: "所有技术文章与设计笔记。",
};

export const dynamic = "force-dynamic";

/**
 * 文章列表页 — 站酷作品墙
 */
export default async function ArticlesPage() {
  const articles = await getAllArticles();
  const author = await getAuthor();

  return (
    <div className="bg-surface pb-8 pt-6">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-sm bg-background p-6 shadow-[var(--card-shadow)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Tag color="gold" className="!mb-3">
              全部作品
            </Tag>
            <h1 className="text-hero text-foreground">文章列表</h1>
            <p className="mt-2 max-w-xl text-sm text-muted">
              {author.name} 的技术笔记、设计思考与开发实践。
            </p>
          </div>
          <Link href="/articles/manage">
            <Button type="primary" size="large">
              管理文章
            </Button>
          </Link>
        </div>
      </div>

      <ArticleGrid articles={articles} title="" showLabel={false} />
    </div>
  );
}
