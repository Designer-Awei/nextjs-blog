import type { Metadata } from "next";
import { ArticleManageList } from "@/components/articles/ArticleManageList";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "文章管理",
  description: "管理博客文章",
};

export const dynamic = "force-dynamic";

/**
 * 文章管理页
 */
export default async function ArticleManagePage() {
  const articles = [...(await getArticles())].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="pt-[4.25rem] pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <ArticleManageList initialArticles={articles} />
      </div>
    </div>
  );
}
