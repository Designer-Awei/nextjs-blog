"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Author } from "@/types";
import { AvatarUploader } from "./AvatarUploader";

interface AuthorEditPanelProps {
  /** 当前作者数据 */
  author: Author;
  /** 是否打开面板 */
  open: boolean;
  /** 关闭面板回调 */
  onClose: () => void;
}

/** 表单字段初始值 */
function toFormState(author: Author) {
  return {
    name: author.name,
    title: author.title,
    bio: author.bio,
    location: author.location,
    email: author.email,
    github: author.social.github ?? "",
    twitter: author.social.twitter ?? "",
    linkedin: author.social.linkedin ?? "",
    xiaohongshu: author.social.xiaohongshu ?? "",
    skills: author.skills.join(", "),
  };
}

/**
 * 个人信息编辑面板 — 侧滑表单
 */
export function AuthorEditPanel({
  author,
  open,
  onClose,
}: AuthorEditPanelProps) {
  const router = useRouter();
  const [form, setForm] = useState(() => toFormState(author));
  const [currentAvatar, setCurrentAvatar] = useState(author.avatar);
  const [currentAvatarUpdatedAt, setCurrentAvatarUpdatedAt] = useState(
    author.avatarUpdatedAt
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(toFormState(author));
      setCurrentAvatar(author.avatar);
      setCurrentAvatarUpdatedAt(author.avatarUpdatedAt);
      setError("");
    }
  }, [open, author]);

  /** 阻止背景滚动 */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /**
   * 提交表单并保存到服务端
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      const payload: Author = {
        ...author,
        avatar: currentAvatar,
        avatarUpdatedAt: currentAvatarUpdatedAt,
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        email: form.email.trim(),
        social: {
          github: form.github.trim() || undefined,
          twitter: form.twitter.trim() || undefined,
          linkedin: form.linkedin.trim() || undefined,
          xiaohongshu: form.xiaohongshu.trim() || undefined,
        },
        skills: form.skills
          .split(/[,，]/)
          .map((s) => s.trim())
          .filter(Boolean),
      };

      try {
        const res = await fetch("/api/author", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "保存失败");
        }

        onClose();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "保存失败");
      } finally {
        setSaving(false);
      }
    },
    [author, currentAvatar, currentAvatarUpdatedAt, form, onClose, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* 遮罩 */}
      <button
        type="button"
        aria-label="关闭编辑面板"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 侧滑面板 */}
      <div className="relative flex h-full w-full max-w-lg flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">编辑个人信息</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
            aria-label="关闭"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <div className="rounded-xl border border-border p-4">
              <p className="mb-3 text-sm font-medium text-foreground">头像</p>
              <AvatarUploader
                name={form.name || author.name}
                avatar={currentAvatar}
                avatarUpdatedAt={currentAvatarUpdatedAt}
                variant="compact"
                onUploaded={(avatar, updatedAt) => {
                  setCurrentAvatar(avatar);
                  setCurrentAvatarUpdatedAt(updatedAt);
                }}
              />
            </div>

            <FormField label="姓名" required>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                required
              />
            </FormField>

            <FormField label="职位" required>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-input"
                required
              />
            </FormField>

            <FormField label="个人简介" required>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="form-input resize-none"
                required
              />
            </FormField>

            <FormField label="所在地">
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="form-input"
              />
            </FormField>

            <FormField label="邮箱">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
              />
            </FormField>

            <fieldset className="space-y-4 rounded-xl border border-border p-4">
              <legend className="px-1 text-xs font-medium text-muted">
                社交链接
              </legend>
              <FormField label="GitHub">
                <input
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="form-input"
                />
              </FormField>
              <FormField label="Twitter / X">
                <input
                  value={form.twitter}
                  onChange={(e) =>
                    setForm({ ...form, twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/username"
                  className="form-input"
                />
              </FormField>
              <FormField label="LinkedIn">
                <input
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="form-input"
                />
              </FormField>
              <FormField label="小红书">
                <input
                  value={form.xiaohongshu}
                  onChange={(e) =>
                    setForm({ ...form, xiaohongshu: e.target.value })
                  }
                  placeholder="https://www.xiaohongshu.com/user/profile/xxx"
                  className="form-input"
                />
              </FormField>
            </fieldset>

            <FormField label="技能栈" hint="多个技能用逗号分隔">
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="Next.js, React, TypeScript"
                className="form-input"
              />
            </FormField>

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
              {saving ? "保存中…" : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

/** 表单字段包装 */
function FormField({ label, required, hint, children }: FormFieldProps) {
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
