"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { AvatarCropModal } from "./AvatarCropModal";
import { ProfileAvatar } from "./ProfileAvatar";
import { readFileAsDataUrl, validateImageFile } from "@/lib/crop-image";

interface AvatarUploaderProps {
  /** 显示名称 */
  name: string;
  /** 当前头像路径 */
  avatar: string;
  /** 头像更新时间戳 */
  avatarUpdatedAt?: number;
  /** 展示模式：preview 带预览，compact 仅按钮 */
  variant?: "preview" | "compact";
  /** 上传成功回调 */
  onUploaded?: (avatar: string, updatedAt: number) => void;
}

/**
 * 头像上传组件 — 选择图片、裁剪、上传
 */
export function AvatarUploader({
  name,
  avatar,
  avatarUpdatedAt: serverUpdatedAt,
  variant = "preview",
  onUploaded,
}: AvatarUploaderProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  /** 本地缓存戳，上传成功后立即更新预览，不被 router.refresh 覆盖 */
  const [localUpdatedAt, setLocalUpdatedAt] = useState<number | undefined>(
    undefined
  );
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const displayUpdatedAt = localUpdatedAt ?? serverUpdatedAt;

  /**
   * 打开文件选择器
   */
  const handleSelectClick = useCallback(() => {
    setError("");
    inputRef.current?.click();
  }, []);

  /**
   * 处理文件选择
   */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";

      if (!file) return;

      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        setImageSrc(dataUrl);
        setCropOpen(true);
      } catch {
        setError("图片读取失败，请重试");
      }
    },
    []
  );

  /**
   * 上传裁剪后的头像
   */
  const handleCropConfirm = useCallback(
    async (blob: Blob) => {
      setUploading(true);
      setError("");

      try {
        const formData = new FormData();
        formData.append("avatar", blob, "avatar.jpg");

        const res = await fetch("/api/author/avatar", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "上传失败");
        }

        setLocalUpdatedAt(data.updatedAt);
        setCropOpen(false);
        setImageSrc(null);
        onUploaded?.(data.avatar, data.updatedAt);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "上传失败");
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [onUploaded, router]
  );

  const handleCropCancel = useCallback(() => {
    setCropOpen(false);
    setImageSrc(null);
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {variant === "preview" ? (
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <div className="group relative">
            <ProfileAvatar
              name={name}
              avatar={avatar}
              avatarUpdatedAt={displayUpdatedAt}
            />
            <button
              type="button"
              onClick={handleSelectClick}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100"
              aria-label="更换头像"
            >
              <CameraIcon />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSelectClick}
            disabled={uploading}
            className="text-xs font-medium text-accent transition-colors hover:text-accent-hover disabled:opacity-60"
          >
            {uploading ? "上传中…" : "更换头像"}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ProfileAvatar
            name={name}
            avatar={avatar}
            avatarUpdatedAt={displayUpdatedAt}
            size="sm"
          />
          <div className="flex-1 space-y-2">
            <button
              type="button"
              onClick={handleSelectClick}
              disabled={uploading}
              className="w-full rounded-xl border border-dashed border-border py-2.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-60"
            >
              {uploading ? "上传中…" : "选择图片并裁剪"}
            </button>
            <p className="text-xs text-muted">支持 JPG / PNG / WebP，最大 5MB</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </div>
      )}

      {imageSrc && (
        <AvatarCropModal
          imageSrc={imageSrc}
          open={cropOpen}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}

/** 相机图标 */
function CameraIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white"
    >
      <path
        d="M4 7h2l1.5-2h9L18 7h2a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
