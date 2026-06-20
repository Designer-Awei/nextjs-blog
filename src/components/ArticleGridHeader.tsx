"use client";

import Link from "next/link";
import { Button } from "antd";
import { ArrowRight } from "react-feather";

interface ArticleGridHeaderProps {
  /** 区块标题 */
  title?: string;
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 是否显示查看全部 */
  showViewAll?: boolean;
}

/**
 * 文章网格头部 — 客户端组件（Ant Design Button + Feather Icon）
 */
export function ArticleGridHeader({
  title = "最新文章",
  showLabel = true,
  showViewAll = false,
}: ArticleGridHeaderProps) {
  if (!title && !showViewAll) {
    return null;
  }

  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        {showLabel && title && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Works
          </p>
        )}
        {title && <h2 className="text-display text-foreground">{title}</h2>}
      </div>
      {showViewAll && (
        <Link href="/articles">
          <Button type="link" icon={<ArrowRight size={14} />}>
            查看全部
          </Button>
        </Link>
      )}
    </div>
  );
}
