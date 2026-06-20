import { getAuthor } from "@/lib/author";

/**
 * 页脚组件
 */
export async function Footer() {
  const author = await getAuthor();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-foreground">{author.name}</p>
          <p className="text-xs text-muted">{author.title}</p>

          <div className="mt-2 flex gap-6">
            {author.social.github && (
              <a
                href={author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent transition-colors hover:text-accent-hover"
              >
                GitHub
              </a>
            )}
            {author.social.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent transition-colors hover:text-accent-hover"
              >
                Twitter
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent transition-colors hover:text-accent-hover"
              >
                LinkedIn
              </a>
            )}
            {author.social.xiaohongshu && (
              <a
                href={author.social.xiaohongshu}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent transition-colors hover:text-accent-hover"
              >
                小红书
              </a>
            )}
          </div>

          <p className="mt-6 text-xs text-muted">
            © {year} {author.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
