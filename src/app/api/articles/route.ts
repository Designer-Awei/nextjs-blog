import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createArticle,
  getArticles,
} from "@/lib/articles";
import type { ArticleSaveMode } from "@/lib/article-validation";
import type { ArticleStatus } from "@/types";

/**
 * 解析请求中的发布状态
 * @param body - 请求体
 */
function parseSaveOptions(body: Record<string, unknown>): {
  status: ArticleStatus;
  mode: ArticleSaveMode;
} {
  const status: ArticleStatus =
    body.status === "published" ? "published" : "draft";
  const mode: ArticleSaveMode = status === "published" ? "publish" : "draft";
  return { status, mode };
}

/**
 * 获取全部文章（管理端，含草稿）
 */
export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "获取文章失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * 创建文章
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { status, mode } = parseSaveOptions(body);
    const article = await createArticle(body, status, mode);
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${article.slug}`);
    revalidatePath("/articles/manage");
    return NextResponse.json({ success: true, article });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "创建失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
