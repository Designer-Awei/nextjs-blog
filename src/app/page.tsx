import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ArticleGrid } from "@/components/ArticleGrid";
import { getAllArticles, getFeaturedArticles } from "@/lib/articles";
import { getAuthor } from "@/lib/author";

/** 首页需动态读取作者数据，确保头像上传后立即生效 */
export const dynamic = "force-dynamic";

/**
 * 首页 — Hero + 关于 + 精选文章
 */
export default async function HomePage() {
  const author = await getAuthor();
  const featuredArticles = await getFeaturedArticles(3);
  const allArticles = await getAllArticles();

  return (
    <>
      <Hero author={author} />
      <AboutSection author={author} articleCount={allArticles.length} />
      <ArticleGrid
        articles={featuredArticles}
        title="最新文章"
        showViewAll
      />
    </>
  );
}
