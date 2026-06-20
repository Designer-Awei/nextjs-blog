"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedImageBlob, type CropArea } from "@/lib/crop-image";

interface AvatarCropModalProps {
  /** 待裁剪图片 Data URL */
  imageSrc: string;
  /** 是否显示 */
  open: boolean;
  /** 取消回调 */
  onCancel: () => void;
  /** 确认裁剪回调 */
  onConfirm: (blob: Blob) => Promise<void>;
}

/**
 * 头像裁剪弹窗 — 支持拖拽调整位置与缩放
 */
export function AvatarCropModal({
  imageSrc,
  open,
  onCancel,
  onConfirm,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * 裁剪区域变化时记录像素坐标
   */
  const handleCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  /**
   * 确认裁剪并上传
   */
  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;

    setSaving(true);
    setError("");

    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      await onConfirm(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "裁剪失败");
    } finally {
      setSaving(false);
    }
  }, [croppedAreaPixels, imageSrc, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="关闭裁剪"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-background shadow-2xl">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">裁剪头像</h3>
          <p className="mt-1 text-xs text-muted">
            拖动图片调整位置，使用滑块放大或缩小
          </p>
        </div>

        {/* 裁剪区域 */}
        <div className="relative h-72 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* 缩放控制 */}
        <div className="space-y-2 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>缩放</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="crop-slider w-full"
            aria-label="缩放滑块"
          />
        </div>

        {error && (
          <p className="px-6 pb-2 text-sm text-red-500">{error}</p>
        )}

        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-60"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving || !croppedAreaPixels}
            className="flex-1 rounded-full bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "保存中…" : "确认上传"}
          </button>
        </div>
      </div>
    </div>
  );
}
