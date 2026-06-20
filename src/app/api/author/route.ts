import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthor, saveAuthor, validateAuthor } from "@/lib/author";

/**
 * 获取作者个人信息
 */
export async function GET() {
  const author = await getAuthor();
  return NextResponse.json(author);
}

/**
 * 保存作者个人信息
 */
export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json();
    const author = validateAuthor(body);
    await saveAuthor(author);
    revalidatePath("/");
    return NextResponse.json({ success: true, author });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "保存失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
