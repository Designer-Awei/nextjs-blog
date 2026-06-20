import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AntdProvider } from "@/components/providers/AntdProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "设计博客 · 站酷风格",
    template: "%s · 设计博客",
  },
  description: "全栈开发者的个人博客，记录技术思考与设计笔记。",
};

/**
 * 根布局 — 站酷风格全局壳层
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AntdRegistry>
          <AntdProvider>
            <Navbar />
            <main className="flex-1 pt-14">{children}</main>
            <Footer />
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
