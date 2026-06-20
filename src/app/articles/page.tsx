import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleGrid";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "文章",
  description: "所有技术文章与学习笔记。",
};

/**
 * 文章列表页
 */
export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-5xl px-6 pb-4 text-center">
        <p className="mb-2 text-sm font-medium text-accent">Blog</p>
        <h1 className="text-hero text-foreground">全部文章</h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-muted">
          技术笔记、设计思考与开发实践的记录。
        </p>
      </div>

      <ArticleGrid articles={articles} title="" showLabel={false} />
    </div>
  );
}
