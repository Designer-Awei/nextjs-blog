import type { Article } from "@/types";

/**
 * 文章 mock 数据
 */
export const articles: Article[] = [
  {
    slug: "nextjs-app-router-guide",
    title: "Next.js App Router 完全指南",
    excerpt:
      "深入理解 App Router 的路由模型、Server Components 与数据获取策略，构建高性能的现代 Web 应用。",
    coverImage: "/covers/nextjs.svg",
    category: "前端开发",
    publishedAt: "2026-03-15",
    readTime: 8,
    tags: ["Next.js", "React", "SSR"],
    content: [
      {
        type: "paragraph",
        text: "Next.js 13 引入的 App Router 彻底改变了我们构建 React 应用的方式。基于文件系统的路由、内置的布局嵌套，以及 Server Components 的一等公民支持，让开发者能够以更直观的方式组织代码。",
      },
      {
        type: "heading",
        text: "为什么选择 App Router？",
      },
      {
        type: "paragraph",
        text: "App Router 的核心优势在于服务端渲染与客户端交互的无缝融合。你可以在同一个组件树中混合使用 Server Components 和 Client Components，按需选择渲染策略，从而优化首屏性能与 SEO。",
      },
      {
        type: "quote",
        text: "好的架构不是添加功能，而是移除不必要的复杂性。",
      },
      {
        type: "heading",
        text: "路由与布局",
      },
      {
        type: "paragraph",
        text: "在 app 目录下，每个文件夹代表一个路由段。layout.tsx 定义共享 UI，page.tsx 定义页面内容。嵌套布局会自动包裹子路由，无需手动配置。",
      },
      {
        type: "code",
        text: "app/\n  layout.tsx      # 根布局\n  page.tsx        # 首页\n  blog/\n    layout.tsx    # 博客布局\n    page.tsx      # 博客列表\n    [slug]/\n      page.tsx    # 文章详情",
        language: "text",
      },
      {
        type: "paragraph",
        text: "通过 generateStaticParams 与 generateMetadata，你可以为动态路由预生成静态页面并定制 SEO 元数据，这在个人博客场景中尤为实用。",
      },
    ],
  },
  {
    slug: "apple-design-principles",
    title: "从苹果官网学 UI 设计原则",
    excerpt:
      "极简、留白、精致排版——解析 Apple 设计语言背后的核心思路，并如何应用到个人项目中。",
    coverImage: "/covers/design.svg",
    category: "设计",
    publishedAt: "2026-02-28",
    readTime: 6,
    tags: ["UI", "设计", "UX"],
    content: [
      {
        type: "paragraph",
        text: "苹果官网是极简主义设计的典范。大量留白、清晰的视觉层级、以及克制而精准的动画，共同营造出一种「内容即主角」的阅读体验。",
      },
      {
        type: "heading",
        text: "留白的力量",
      },
      {
        type: "paragraph",
        text: "Apple 从不吝啬留白。元素之间的间距往往比直觉中更大，但这正是让页面「呼吸」的关键。适当的留白引导用户视线，突出核心信息，避免视觉疲劳。",
      },
      {
        type: "heading",
        text: "排版即设计",
      },
      {
        type: "paragraph",
        text: "大号标题配合 tight letter-spacing，正文使用适中的行高与字重对比——这些排版细节构成了 Apple 网站独特的气质。选择一款优质的无衬线字体，并建立一致的字体尺度系统，是复刻这种风格的第一步。",
      },
      {
        type: "quote",
        text: "Design is not just what it looks like and feels like. Design is how it works.",
      },
      {
        type: "paragraph",
        text: "最后，动画应当服务于功能而非炫技。Apple 的过渡效果通常 subtle 而流畅，帮助用户理解界面状态的变化，而不是分散注意力。",
      },
    ],
  },
  {
    slug: "typescript-tips-2026",
    title: "TypeScript 实用技巧精选",
    excerpt:
      "类型体操不必复杂——这些日常开发中真正好用的 TypeScript 模式，能显著提升代码质量。",
    coverImage: "/covers/typescript.svg",
    category: "编程语言",
    publishedAt: "2026-01-20",
    readTime: 10,
    tags: ["TypeScript", "最佳实践"],
    content: [
      {
        type: "paragraph",
        text: "TypeScript 的类型系统强大而灵活，但日常开发中我们更需要的是简洁、可维护的类型模式，而非复杂的类型体操。",
      },
      {
        type: "heading",
        text: "善用 satisfies 运算符",
      },
      {
        type: "paragraph",
        text: "satisfies 让你在保持类型推断的同时，确保值符合某个类型约束。它比 as 断言更安全，比显式注解更灵活。",
      },
      {
        type: "code",
        text: "const config = {\n  theme: 'dark',\n  locale: 'zh-CN',\n} satisfies Record<string, string>;",
        language: "typescript",
      },
      {
        type: "heading",
        text: " discriminated unions 处理状态",
      },
      {
        type: "paragraph",
        text: "对于异步数据加载这类场景，使用带 status 字段的联合类型，可以让 TypeScript 在 switch 分支中自动窄化类型，消除大量的可选链与断言。",
      },
      {
        type: "quote",
        text: "类型应当描述数据的形状，而不是描述你如何绕开类型检查。",
      },
    ],
  },
  {
    slug: "building-personal-blog",
    title: "搭建个人博客的正确姿势",
    excerpt:
      "从选型到部署，分享我搭建这个 Next.js 博客的思考过程与技术决策。",
    coverImage: "/covers/blog.svg",
    category: "随笔",
    publishedAt: "2025-12-10",
    readTime: 5,
    tags: ["博客", "Next.js", "部署"],
    content: [
      {
        type: "paragraph",
        text: "个人博客是开发者最好的名片。它不仅是知识的沉淀，更是思考过程的记录。选择 Next.js 作为框架，是因为它提供了从开发到部署的完整解决方案。",
      },
      {
        type: "heading",
        text: "技术选型",
      },
      {
        type: "paragraph",
        text: "Next.js + TypeScript + Tailwind CSS 是当前个人项目的黄金组合。App Router 的静态生成能力让博客页面加载极快，Tailwind 则让定制 Apple 风格 UI 变得高效。",
      },
      {
        type: "heading",
        text: "内容策略",
      },
      {
        type: "paragraph",
        text: "初期使用 mock 数据快速验证 UI 与交互，后续可以接入 MDX 文件或 Headless CMS。关键是先让网站「活起来」，再逐步完善内容管理流程。",
      },
    ],
  },
];
