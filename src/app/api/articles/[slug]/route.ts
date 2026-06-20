import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  deleteArticle,
  getArticleBySlugForManage,
  updateArticle,
} from "@/lib/articles";
import type { ArticleSaveMode } from "@/lib/article-validation";
import type { ArticleStatus } from "@/types";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * 解析更新请求中的发布状态
 * @param body - 请求体
 */
function parseSaveOptions(body: Record<string, unknown>): {
  status?: ArticleStatus;
  mode: ArticleSaveMode;
} {
  const status =
    body.status === "published"
      ? "published"
      : body.status === "draft"
        ? "draft"
        : undefined;
  const mode: ArticleSaveMode =
    status === "published" ? "publish" : "draft";
  return { status, mode };
}

/**
 * 获取单篇文章（管理端可读草稿）
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlugForManage(slug);
    if (!article) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "获取文章失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * 更新文章
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const { status, mode } = parseSaveOptions(body);
    const article = await updateArticle(slug, body, status, mode);
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/articles/${article.slug}`);
    revalidatePath("/articles/manage");
    return NextResponse.json({ success: true, article });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "更新失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * 删除文章
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await deleteArticle(slug);
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    revalidatePath("/articles/manage");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "删除失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
