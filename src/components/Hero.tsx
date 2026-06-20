import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/types";
import { UNSPLASH } from "@/lib/unsplash";
import { HeroActions } from "./HeroActions";

interface HeroProps {
  /** 作者个人信息 */
  author: Author;
}

/**
 * 首页 Hero — 站酷风格大图 Banner + 黄强调 CTA
 */
export function Hero({ author }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative min-h-[420px] overflow-hidden rounded-sm sm:min-h-[480px]">
          <Image
            src={UNSPLASH.hero}
            alt="创意工作区"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

          <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-center px-6 py-16 sm:min-h-[480px] sm:px-12">
            <span className="mb-4 inline-flex w-fit items-center rounded-sm bg-accent px-3 py-1 text-xs font-bold text-accent-text">
              首页推荐
            </span>
            <h1 className="max-w-2xl text-hero text-white">{author.name}</h1>
            <p className="mt-3 max-w-xl text-base font-medium text-white/90 sm:text-lg">
              {author.title}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {author.bio}
            </p>
            <HeroActions />
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-center gap-8 px-4 sm:px-6">
          <span className="zcool-section-tab zcool-section-tab-active">
            为你推荐
          </span>
          <Link
            href="/articles"
            className="zcool-section-tab hover:text-foreground"
          >
            全部作品
          </Link>
        </div>
      </div>
    </section>
  );
}
