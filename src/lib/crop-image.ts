/** 裁剪区域像素坐标 */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 加载图片为 HTMLImageElement
 * @param url - 图片地址
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

/**
 * 根据裁剪区域生成 JPEG Blob
 * @param imageSrc - 原图地址
 * @param pixelCrop - 裁剪区域
 * @param outputSize - 输出尺寸，默认 400px
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: CropArea,
  outputSize = 400
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("无法创建 Canvas 上下文");
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("裁剪失败，请重试"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}

/**
 * 读取本地文件为 Data URL
 * @param file - 图片文件
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

/** 允许上传的图片 MIME 类型 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** 上传前最大文件大小（5MB） */
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

/**
 * 校验上传的图片文件
 * @param file - 待校验文件
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "仅支持 JPG、PNG、WebP 格式";
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return "图片大小不能超过 5MB";
  }
  return null;
}
