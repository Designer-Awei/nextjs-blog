import Link from "next/link";

/**
 * 404 页面
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-display text-foreground">404</h1>
      <p className="mt-4 text-base text-muted">抱歉，您访问的页面不存在。</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        返回首页
      </Link>
    </div>
  );
}
