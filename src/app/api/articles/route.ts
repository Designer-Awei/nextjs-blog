import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createArticle, getArticles } from "@/lib/articles";

/**
 * 获取全部文章
 */
export async function GET() {
  const articles = await getArticles();
  return NextResponse.json(articles);
}

/**
 * 创建文章
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const article = await createArticle(body);
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
