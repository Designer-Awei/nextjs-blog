"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { Home, User, BookOpen, Search, Edit3 } from "react-feather";

/** 导航链接配置 */
const navLinks = [
  { href: "/", label: "首页", icon: Home },
  { href: "/#about", label: "关于", icon: User },
  { href: "/articles", label: "文章", icon: BookOpen },
];

/**
 * 顶部导航 — 站酷白底黄强调风格
 */
export function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return (
    <header className="zcool-nav fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-sm font-bold text-accent-text">
            B
          </span>
          <span className="hidden text-base font-bold text-foreground sm:inline">
            设计博客
          </span>
        </Link>

        <nav className="flex flex-1 items-center" aria-label="主导航">
          <ul className="flex items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/" && hash !== "#about"
                  : link.href === "/#about"
                    ? pathname === "/" && hash === "#about"
                    : pathname.startsWith("/articles");

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`zcool-nav-link ${isActive ? "zcool-nav-link-active" : ""}`}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Input
            prefix={<Search size={14} className="text-muted" />}
            placeholder="搜索文章"
            className="w-44"
            allowClear
          />
          <Link href="/articles/manage">
            <Button type="primary" icon={<Edit3 size={14} />}>
              发布
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
