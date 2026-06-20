"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Article } from "@/types";
import { ArticleEditorPanel } from "./ArticleEditorPanel";

interface ArticleManageListProps {
  /** 初始文章列表 */
  initialArticles: Article[];
}

/**
 * 格式化日期
 * @param dateStr - ISO 日期
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * 文章管理列表
 */
export function ArticleManageList({ initialArticles }: ArticleManageListProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [editing, setEditing] = useState<Article | null | "new">(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * 刷新列表
   */
  const refreshList = useCallback(async () => {
    const res = await fetch("/api/articles");
    const data: Article[] = await res.json();
    setArticles(
      [...data].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    );
    router.refresh();
  }, [router]);

  /**
   * 删除文章
   */
  const handleDelete = useCallback(
    async (slug: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "删除失败");
        setDeletingSlug(null);
        await refreshList();
      } catch (err) {
        alert(err instanceof Error ? err.message : "删除失败");
      } finally {
        setLoading(false);
      }
    },
    [refreshList]
  );

  const editorArticle =
    editing === "new" ? null : editing === null ? null : editing;

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Link
            href="/articles"
            className="mb-3 inline-flex text-sm text-accent transition-colors hover:text-accent-hover"
          >
            ← 返回文章列表
          </Link>
          <p className="mb-1 text-sm font-medium text-accent">Manage</p>
          <h1 className="text-display text-foreground">文章管理</h1>
          <p className="mt-2 text-sm text-muted">共 {articles.length} 篇文章</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          + 新建文章
        </button>
      </div>

      <div className="space-y-3">
        {articles.length === 0 && (
          <div className="bento-card py-16 text-center text-muted">
            暂无文章，点击「新建文章」开始创作
          </div>
        )}

        {articles.map((article) => (
          <div
            key={article.slug}
            className="bento-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{article.category}</span>
                <span>·</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span>·</span>
                <span>{article.readTime} 分钟</span>
              </div>
              <h2 className="truncate text-base font-semibold text-foreground">
                {article.title}
              </h2>
              <p className="mt-1 line-clamp-1 text-sm text-muted">
                {article.excerpt}
              </p>
              {article.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 font-mono text-xs text-muted/70">
                /articles/{article.slug}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/articles/${article.slug}`}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface"
              >
                预览
              </Link>
              <button
                type="button"
                onClick={() => setEditing(article)}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface"
              >
                编辑
              </button>
              <button
                type="button"
                onClick={() => setDeletingSlug(article.slug)}
                className="rounded-full border border-red-500/30 px-4 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 删除确认 */}
      {deletingSlug && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeletingSlug(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">确认删除</h3>
            <p className="mt-2 text-sm text-muted">
              删除后无法恢复，确定要删除这篇文章吗？
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingSlug(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium"
              >
                取消
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingSlug)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? "删除中…" : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ArticleEditorPanel
        article={editorArticle}
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSaved={refreshList}
      />
    </>
  );
}
