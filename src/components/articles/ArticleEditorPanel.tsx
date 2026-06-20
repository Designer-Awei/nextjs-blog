"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Article } from "@/types";
import {
  createEmptyArticle,
  estimateReadTime,
  slugify,
} from "@/lib/article-validation";
import { ContentBlockEditor } from "./ContentBlockEditor";

interface ArticleEditorPanelProps {
  /** 编辑中的文章，null 表示新建 */
  article: Article | null;
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 保存成功回调 */
  onSaved: () => void;
}

/**
 * 文章编辑侧滑面板
 */
export function ArticleEditorPanel({
  article,
  open,
  onClose,
  onSaved,
}: ArticleEditorPanelProps) {
  const router = useRouter();
  const isNew = article === null;
  const originalSlug = article?.slug ?? "";

  const [form, setForm] = useState<Article>(() => article ?? createEmptyArticle());
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      const initial = article ?? createEmptyArticle();
      setForm(initial);
      setTagsInput(initial.tags.join(", "));
      setSlugTouched(!!article);
      setError("");
    }
  }, [open, article]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /**
   * 标题变更时自动生成 slug
   */
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  };

  /**
   * 保存文章
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      const payload: Article = {
        ...form,
        tags: tagsInput
          .split(/[,，]/)
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: form.readTime || estimateReadTime(form.content),
      };

      try {
        const url = isNew
          ? "/api/articles"
          : `/api/articles/${encodeURIComponent(originalSlug)}`;
        const method = isNew ? "POST" : "PUT";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "保存失败");

        onSaved();
        onClose();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "保存失败");
      } finally {
        setSaving(false);
      }
    },
    [form, isNew, onClose, onSaved, originalSlug, router, tagsInput]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="关闭编辑面板"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full max-w-2xl flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            {isNew ? "新建文章" : "编辑文章"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <EditorField label="标题" required>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="form-input"
                required
              />
            </EditorField>

            <EditorField label="Slug" required hint="URL 路径，仅小写字母、数字、连字符">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                className="form-input font-mono text-sm"
                required
              />
            </EditorField>

            <EditorField label="摘要" required>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="form-input resize-none"
                required
              />
            </EditorField>

            <div className="grid gap-4 sm:grid-cols-2">
              <EditorField label="分类" required>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </EditorField>
              <EditorField label="发布日期" required>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm({ ...form, publishedAt: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </EditorField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EditorField label="标签" hint="逗号分隔">
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Next.js, React"
                  className="form-input"
                />
              </EditorField>
              <EditorField label="阅读时长（分钟）">
                <input
                  type="number"
                  min={1}
                  value={form.readTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      readTime: Number(e.target.value) || 1,
                    })
                  }
                  className="form-input"
                />
              </EditorField>
            </div>

            <ContentBlockEditor
              blocks={form.content}
              onChange={(content) => setForm({ ...form, content })}
            />

            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {saving ? "保存中…" : "保存文章"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditorFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

/** 表单字段 */
function EditorField({ label, required, hint, children }: EditorFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      {children}
    </label>
  );
}
