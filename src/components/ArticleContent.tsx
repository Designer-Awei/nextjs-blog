import type { ArticleBlock } from "@/types";

interface ArticleContentProps {
  /** 文章内容块数组 */
  blocks: ArticleBlock[];
}

/**
 * 渲染文章内容块
 */
export function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <div className="prose-apple">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h2 key={index}>{block.text}</h2>;
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "quote":
            return <blockquote key={index}>{block.text}</blockquote>;
          case "code":
            return (
              <pre key={index}>
                <code>{block.text}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
