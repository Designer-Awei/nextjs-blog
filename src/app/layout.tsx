import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "张明 · 个人博客",
    template: "%s · 张明",
  },
  description: "全栈开发者的个人博客，记录技术思考与学习笔记。",
};

/**
 * 根布局 — 全局导航与页脚
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1 pt-[4.25rem]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
