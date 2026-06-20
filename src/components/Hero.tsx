import Link from "next/link";
import type { Author } from "@/types";

interface HeroProps {
  /** 作者个人信息 */
  author: Author;
}

/**
 * 首页 Hero 区域 — 大标题 + 个人简介
 */
export function Hero({ author }: HeroProps) {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 pt-12 text-center">
      <div className="animate-fade-up mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-medium text-accent">{author.title}</p>
        <h1 className="text-hero text-foreground">{author.name}</h1>
        <p className="animate-fade-up animation-delay-100 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {author.bio}
        </p>
        <div className="animate-fade-up animation-delay-200 mt-10 flex items-center justify-center gap-4">
          <Link
            href="/articles"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            阅读文章
          </Link>
          <Link
            href="/#about"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            了解更多
          </Link>
        </div>
      </div>
    </section>
  );
}
