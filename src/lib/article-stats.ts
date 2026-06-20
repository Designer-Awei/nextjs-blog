/**
 * 根据 slug 生成稳定的展示数据（浏览/点赞/评论）
 * @param slug - 文章 slug
 */
export function getArticleStats(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }

  const seed = Math.abs(hash);
  return {
    views: 120 + (seed % 900),
    likes: 12 + (seed % 180),
    comments: 2 + (seed % 40),
  };
}
