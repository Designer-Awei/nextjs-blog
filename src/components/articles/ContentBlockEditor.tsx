"use client";

import type { ArticleBlock } from "@/types";

interface ContentBlockEditorProps {
  /** 内容块列表 */
  blocks: ArticleBlock[];
  /** 变更回调 */
  onChange: (blocks: ArticleBlock[]) => void;
}

const BLOCK_TYPES = [
  { value: "paragraph", label: "段落" },
  { value: "heading", label: "标题" },
  { value: "quote", label: "引用" },
  { value: "code", label: "代码" },
] as const;

/**
 * 文章内容块编辑器
 */
export function ContentBlockEditor({ blocks, onChange }: ContentBlockEditorProps) {
  /**
   * 更新单个块
   */
  const updateBlock = (index: number, patch: Partial<ArticleBlock>) => {
    const next = blocks.map((block, i) =>
      i === index ? ({ ...block, ...patch } as ArticleBlock) : block
    );
    onChange(next);
  };

  /**
   * 删除块
   */
  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    onChange(blocks.filter((_, i) => i !== index));
  };

  /**
   * 移动块
   */
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  /**
   * 添加块
   */
  const addBlock = (type: ArticleBlock["type"]) => {
    const block: ArticleBlock =
      type === "code"
        ? { type: "code", text: "", language: "text" }
        : { type, text: "" };
    onChange([...blocks, block]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">正文内容</p>
        <div className="flex flex-wrap gap-1.5">
          {BLOCK_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => addBlock(t.value)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/30 hover:text-foreground"
            >
              + {t.label}
            </button>
          ))}
        </div>
      </div>

      {blocks.map((block, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-surface/50 p-3 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <select
              value={block.type}
              onChange={(e) =>
                updateBlock(index, {
                  type: e.target.value as ArticleBlock["type"],
                })
              }
              className="form-input w-auto py-1 text-xs"
            >
              {BLOCK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="flex gap-1">
              <IconButton
                label="上移"
                onClick={() => moveBlock(index, -1)}
                disabled={index === 0}
              >
                ↑
              </IconButton>
              <IconButton
                label="下移"
                onClick={() => moveBlock(index, 1)}
                disabled={index === blocks.length - 1}
              >
                ↓
              </IconButton>
              <IconButton
                label="删除"
                onClick={() => removeBlock(index)}
                disabled={blocks.length <= 1}
              >
                ×
              </IconButton>
            </div>
          </div>

          {block.type === "code" && (
            <input
              value={block.language ?? "text"}
              onChange={(e) =>
                updateBlock(index, { language: e.target.value })
              }
              placeholder="语言标识，如 typescript"
              className="form-input text-xs"
            />
          )}

          <textarea
            value={block.text}
            onChange={(e) => updateBlock(index, { text: e.target.value })}
            rows={block.type === "code" ? 5 : block.type === "paragraph" ? 4 : 2}
            placeholder={
              block.type === "heading"
                ? "输入小标题"
                : block.type === "quote"
                  ? "输入引用文字"
                  : block.type === "code"
                    ? "输入代码"
                    : "输入段落内容"
            }
            className="form-input resize-none font-mono text-sm"
          />
        </div>
      ))}
    </div>
  );
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

/** 图标按钮 */
function IconButton({ label, onClick, disabled, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-xs text-muted transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
    >
      {children}
    </button>
  );
}
