import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { saveAvatarAndUpdateAuthor } from "@/lib/author";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from "@/lib/crop-image";

/**
 * 上传并保存裁剪后的头像
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请上传头像文件" }, { status: 400 });
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "仅支持 JPG、PNG、WebP 格式" },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "图片大小不能超过 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { avatar, updatedAt } = await saveAvatarAndUpdateAuthor(buffer);

    revalidatePath("/");

    return NextResponse.json({ success: true, avatar, updatedAt });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "头像上传失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
