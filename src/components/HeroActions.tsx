"use client";

import Link from "next/link";
import { Button } from "antd";
import { ArrowRight, User } from "react-feather";

/**
 * Hero 行动按钮组
 */
export function HeroActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <Link href="/articles">
        <Button type="primary" size="large" icon={<ArrowRight size={16} />}>
          浏览文章
        </Button>
      </Link>
      <Link href="/#about">
        <Button
          size="large"
          icon={<User size={16} />}
          className="!border-white/30 !bg-white/10 !text-white hover:!bg-white/20 hover:!text-white"
        >
          关于我
        </Button>
      </Link>
    </div>
  );
}
