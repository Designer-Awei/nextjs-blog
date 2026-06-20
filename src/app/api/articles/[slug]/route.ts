import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  deleteArticle,
  getArticleBySlug,
  updateArticle,
} from "@/lib/articles";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * 获取单篇文章
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  return NextResponse.json(article);
}

/**
 * 更新文章
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body: unknown = await request.json();
    const article = await updateArticle(slug, body);
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
