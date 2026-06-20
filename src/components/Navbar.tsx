"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** 导航链接配置 */
const navLinks = [
  { href: "/", label: "首页" },
  { href: "/#about", label: "关于" },
  { href: "/articles", label: "文章" },
];

/**
 * 顶部导航栏 — Apple Liquid Glass 流动半透明风格
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return (
    <header
      className={`nav-glass-shell fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:px-6 ${scrolled ? "nav-glass-scrolled" : ""}`}
    >
      <nav
        className="nav-glass relative mx-auto flex h-11 max-w-xl items-center justify-between gap-4 px-1.5 sm:px-2"
        aria-label="主导航"
      >
        <Link href="/" className="nav-brand shrink-0 pl-3 sm:pl-4">
          Blog
        </Link>

        <ul className="nav-link-group flex items-center gap-0.5 p-0.5 sm:gap-1">
          {navLinks.map((link) => {
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
                  className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
