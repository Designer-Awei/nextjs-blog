import Link from "next/link";
import { Tag } from "antd";
import { GitHub, Linkedin, Twitter } from "react-feather";
import { getAuthor } from "@/lib/author";

/**
 * 页脚 — 站酷风格
 */
export async function Footer() {
  const author = await getAuthor();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent text-xs font-bold text-accent-text">
                B
              </span>
              <p className="text-sm font-bold text-foreground">{author.name}</p>
            </div>
            <p className="mt-1 text-xs text-muted">{author.title}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {author.social.github && (
              <Link href={author.social.github} target="_blank">
                <Tag icon={<GitHub size={12} />} className="!cursor-pointer">
                  GitHub
                </Tag>
              </Link>
            )}
            {author.social.twitter && (
              <Link href={author.social.twitter} target="_blank">
                <Tag icon={<Twitter size={12} />} className="!cursor-pointer">
                  Twitter
                </Tag>
              </Link>
            )}
            {author.social.linkedin && (
              <Link href={author.social.linkedin} target="_blank">
                <Tag icon={<Linkedin size={12} />} className="!cursor-pointer">
                  LinkedIn
                </Tag>
              </Link>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          © {year} {author.name}. 设计灵感来自站酷 · 图片素材 Unsplash
        </p>
      </div>
    </footer>
  );
}
