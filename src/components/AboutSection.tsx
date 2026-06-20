"use client";

import { useState } from "react";
import type { Author } from "@/types";
import { AuthorEditPanel } from "./AuthorEditPanel";
import { AvatarUploader } from "./AvatarUploader";

interface AboutSectionProps {
  /** 作者个人信息 */
  author: Author;
  /** 已发布文章数量 */
  articleCount: number;
}

/**
 * 关于我区块 — Apple 风格 Bento 布局 + 编辑入口
 */
export function AboutSection({ author, articleCount }: AboutSectionProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <section id="about" className="bg-surface py-28">
        <div className="mx-auto max-w-5xl px-6">
          {/* 区块标题 */}
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-accent">About</p>
              <h2 className="text-display text-foreground">关于我</h2>
            </div>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="group flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-accent/30 hover:shadow-md"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-muted transition-colors group-hover:text-accent"
              >
                <path
                  d="M10.5 1.5l2 2L4.5 11.5H2.5V9.5L10.5 1.5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              编辑资料
            </button>
          </div>

          {/* Bento 网格 */}
          <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
            {/* 主 Profile 卡片 — 占 4 列 */}
            <div className="bento-card md:col-span-4 md:row-span-2">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                <AvatarUploader
                  name={author.name}
                  avatar={author.avatar}
                  avatarUpdatedAt={author.avatarUpdatedAt}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {author.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {author.title}
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-muted">
                    {author.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* 统计卡片 */}
            <StatCard
              label="已发布文章"
              value={String(articleCount)}
              className="md:col-span-2"
            />
            <StatCard
              label="技能领域"
              value={String(author.skills.length)}
              suffix="项"
              className="md:col-span-1"
            />

            {/* 联系信息卡片 */}
            <div className="bento-card md:col-span-1">
              <CardLabel>联系方式</CardLabel>
              <ul className="mt-4 space-y-4">
                <ContactItem
                  icon="location"
                  label="位置"
                  value={author.location}
                />
                <ContactItem
                  icon="email"
                  label="邮箱"
                  value={author.email}
                  href={`mailto:${author.email}`}
                />
              </ul>
            </div>

            {/* 社交链接卡片 */}
            <div className="bento-card md:col-span-2">
              <CardLabel>社交账号</CardLabel>
              <div className="mt-4 flex flex-wrap gap-3">
                {author.social.github && (
                  <SocialButton
                    href={author.social.github}
                    label="GitHub"
                    icon="github"
                  />
                )}
                {author.social.twitter && (
                  <SocialButton
                    href={author.social.twitter}
                    label="Twitter"
                    icon="twitter"
                  />
                )}
                {author.social.linkedin && (
                  <SocialButton
                    href={author.social.linkedin}
                    label="LinkedIn"
                    icon="linkedin"
                  />
                )}
                {author.social.xiaohongshu && (
                  <SocialButton
                    href={author.social.xiaohongshu}
                    label="小红书"
                    icon="xiaohongshu"
                  />
                )}
                {!author.social.github &&
                  !author.social.twitter &&
                  !author.social.linkedin &&
                  !author.social.xiaohongshu && (
                    <p className="text-sm text-muted">暂未添加社交链接</p>
                  )}
              </div>
            </div>

            {/* 技能栈卡片 — 全宽 */}
            <div className="bento-card md:col-span-6">
              <CardLabel>技能栈</CardLabel>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {author.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {author.skills.length === 0 && (
                  <p className="text-sm text-muted">暂未添加技能</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthorEditPanel
        author={author}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  className?: string;
}

/** 数据统计小卡片 */
function StatCard({ label, value, suffix, className }: StatCardProps) {
  return (
    <div className={`bento-card flex flex-col justify-between ${className ?? ""}`}>
      <CardLabel>{label}</CardLabel>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
        {value}
        {suffix && (
          <span className="ml-1 text-lg font-normal text-muted">{suffix}</span>
        )}
      </p>
    </div>
  );
}

/** 卡片小标题 */
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-muted">
      {children}
    </p>
  );
}

interface ContactItemProps {
  icon: "location" | "email";
  label: string;
  value: string;
  href?: string;
}

/** 联系方式条目 */
function ContactItem({ icon, label, value, href }: ContactItemProps) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
        {icon === "location" ? <LocationIcon /> : <EmailIcon />}
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 text-sm text-foreground">{value || "—"}</p>
      </div>
    </div>
  );

  if (href && value) {
    return (
      <li>
        <a
          href={href}
          className="block rounded-xl transition-colors hover:bg-surface/80"
        >
          {content}
        </a>
      </li>
    );
  }

  return <li>{content}</li>;
}

interface SocialButtonProps {
  href: string;
  label: string;
  icon: "github" | "twitter" | "linkedin" | "xiaohongshu";
}

/** 社交链接按钮 */
function SocialButton({ href, label, icon }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-all hover:border-accent/30 hover:shadow-sm"
    >
      {icon === "github" && <GithubIcon />}
      {icon === "twitter" && <TwitterIcon />}
      {icon === "linkedin" && <LinkedinIcon />}
      {icon === "xiaohongshu" && <XiaohongshuIcon />}
      {label}
    </a>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 8.5a2 2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 14s5-3.5 5-7a5 5 0 10-10 0c0 3.5 5 7 5 7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="4"
        width="12"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M2 5l6 4 6-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.18.82a7.49 7.49 0 012-.27c.68 0 1.36.09 2 .27 1.51-1.04 2.18-.82 2.18-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.52 6.77L15.28 0h-1.36L8.9 5.88 4.78 0H0l6.05 8.48L0 16h1.36l5.28-6.12L10.9 16H16L9.52 6.77zm-1.87 2.17L7.28 7.6 2.2 1.04h2.08l4.12 4.77.37.43 3.47 4.76h-2.08L7.65 8.94z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0012.5 2h-9zM4 4h1.5v8H4V4zm.75-2.5a1 1 0 110 2 1 1 0 010-2zM6 4h1.4v1.1h.02c.2-.38.68-.92 1.4-.92 1.5 0 1.78.99 1.78 2.28V12H9.8v-3.6c0-.86-.02-1.96-1.2-1.96-1.2 0-1.38.94-1.38 1.9V12H6V4z" />
    </svg>
  );
}

/** 小红书图标 */
function XiaohongshuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3" fill="#FF2442" />
      <path
        d="M5.2 5.5h1.1l.7 2.1.7-2.1h1l-1.2 3.2v1.8H6.4V8.7L5.2 5.5zm4.1 0h1v5h-1v-5z"
        fill="white"
      />
    </svg>
  );
}
