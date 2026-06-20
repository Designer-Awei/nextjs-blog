/**
 * 作者个人信息
 */
export interface Author {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  /** 头像最后更新时间戳，用于缓存刷新 */
  avatarUpdatedAt?: number;
  location: string;
  email: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    xiaohongshu?: string;
  };
  skills: string[];
}

/**
 * 文章摘要（列表页使用）
 */
export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

/**
 * 文章详情
 */
export interface Article extends ArticleSummary {
  content: ArticleBlock[];
}

/**
 * 文章内容块
 */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; text: string; language?: string };
