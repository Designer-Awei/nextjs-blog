"use client";

import { buildAvatarSrc, normalizeAvatarPath } from "@/lib/avatar-url";

interface ProfileAvatarProps {
  /** 显示名称，用于 alt 与首字 fallback */
  name: string;
  /** 头像图片路径 */
  avatar: string;
  /** 头像更新时间戳，用于缓存刷新 */
  avatarUpdatedAt?: number;
  /** 尺寸，默认 112px */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { className: "h-20 w-20", rounded: "rounded-2xl", text: "text-3xl" },
  md: { className: "h-28 w-28", rounded: "rounded-3xl", text: "text-4xl" },
  lg: { className: "h-36 w-36", rounded: "rounded-3xl", text: "text-5xl" },
};

/**
 * 个人头像 — 使用原生 img 避免 next/image 缓存问题
 */
export function ProfileAvatar({
  name,
  avatar,
  avatarUpdatedAt,
  size = "md",
}: ProfileAvatarProps) {
  const config = sizeMap[size];
  const path = normalizeAvatarPath(avatar);
  const hasPhoto = path && !path.endsWith(".svg");
  const imageSrc = buildAvatarSrc(path, avatarUpdatedAt);

  return (
    <div className="relative shrink-0">
      <div
        className={`absolute -inset-1 ${config.rounded} bg-gradient-to-br from-accent/40 via-accent/10 to-transparent opacity-80 blur-sm`}
      />
      <div
        className={`relative ${config.className} overflow-hidden ${config.rounded} bg-gradient-to-br from-accent/20 to-accent/5 ring-1 ring-border`}
      >
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={avatarUpdatedAt ?? path}
            src={imageSrc}
            alt={`${name} 的头像`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className={`${config.text} font-semibold text-accent/50`}>
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
