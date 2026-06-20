import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

/**
 * 从 .env.local 加载环境变量
 */
function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error("未找到 .env.local，请先配置 Supabase 环境变量");
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

/**
 * 将 JSON 文章转为数据库插入格式
 * @param article - 本地文章对象
 */
function mapArticleInsert(article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    cover_image: article.coverImage ?? "",
    category: article.category,
    published_at: article.publishedAt,
    read_time: article.readTime ?? 1,
    tags: Array.isArray(article.tags) ? article.tags : [],
    status: article.status === "draft" ? "draft" : "published",
  };
}

/**
 * 将内容块转为数据库插入格式
 * @param articleId - 文章 ID
 * @param blocks - 内容块数组
 */
function mapBlocksInsert(articleId, blocks) {
  return (blocks ?? []).map((block, index) => ({
    article_id: articleId,
    sort_order: index,
    type: block.type,
    text: block.text,
    language: block.type === "code" ? (block.language ?? null) : null,
  }));
}

const AVATAR_BUCKET = "avatars";
const DEFAULT_AVATAR_PATH = "default/avatar.jpg";
const DEFAULT_AVATAR_SEED =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80";

/**
 * 构建 Storage 公开 URL
 * @param projectUrl - Supabase 项目 URL
 * @param objectPath - 对象路径
 */
function getAvatarPublicUrl(projectUrl, objectPath) {
  return `${projectUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${objectPath}`;
}

/**
 * 判断是否为 legacy 本地头像路径
 * @param avatar - 头像路径
 */
function isLegacyLocalAvatar(avatar) {
  if (!avatar) return true;
  return avatar.startsWith("/images/") || avatar.startsWith("/");
}

/**
 * 将头像上传到 Storage 并更新 authors.avatar_url
 * @param supabase - Supabase 客户端
 * @param projectUrl - 项目 URL
 */
async function migrateAvatarToStorage(supabase, projectUrl) {
  const publicUrl = getAvatarPublicUrl(projectUrl, DEFAULT_AVATAR_PATH);
  const localCandidates = [
    path.join(root, "public", "images", "avatar.jpg"),
    path.join(root, "public", "images", "avatar.png"),
    path.join(root, "public", "images", "avatar.webp"),
  ];

  let buffer = null;
  let contentType = "image/jpeg";

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      buffer = fs.readFileSync(candidate);
      if (candidate.endsWith(".png")) contentType = "image/png";
      if (candidate.endsWith(".webp")) contentType = "image/webp";
      break;
    }
  }

  if (!buffer) {
    const response = await fetch(DEFAULT_AVATAR_SEED);
    if (!response.ok) {
      throw new Error("无法下载默认头像种子图");
    }
    buffer = Buffer.from(await response.arrayBuffer());
  }

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(DEFAULT_AVATAR_PATH, buffer, { contentType, upsert: true });

  if (uploadError) {
    throw new Error(`头像上传到 Storage 失败: ${uploadError.message}`);
  }

  const { data: authors, error: listError } = await supabase
    .from("authors")
    .select("id, avatar_url");

  if (listError) throw new Error(listError.message);

  const updatedAt = Date.now();
  let updated = 0;

  for (const author of authors ?? []) {
    if (!isLegacyLocalAvatar(author.avatar_url)) continue;

    const { error } = await supabase
      .from("authors")
      .update({
        avatar_url: publicUrl,
        avatar_updated_at: updatedAt,
      })
      .eq("id", author.id);

    if (error) throw new Error(`更新作者头像 URL 失败: ${error.message}`);
    updated += 1;
  }

  const authorJsonPath = path.join(root, "data", "author.json");
  if (fs.existsSync(authorJsonPath)) {
    const authorJson = JSON.parse(fs.readFileSync(authorJsonPath, "utf8"));
    if (isLegacyLocalAvatar(authorJson.avatar)) {
      authorJson.avatar = publicUrl;
      authorJson.avatarUpdatedAt = updatedAt;
      fs.writeFileSync(authorJsonPath, `${JSON.stringify(authorJson, null, 2)}\n`);
    }
  }

  console.log(`✓ 头像已上传至 Storage 公开桶 (${publicUrl})`);
  if (updated > 0) {
    console.log(`✓ 已更新 ${updated} 条作者记录的 avatar_url`);
  } else {
    console.log("· 作者 avatar_url 已是 Storage URL，跳过数据库更新");
  }
}

/**
 * 将本地 JSON 数据迁移到 Supabase
 */
async function migrate() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  const supabase = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const authorPath = path.join(root, "data", "author.json");
  const articlesPath = path.join(root, "data", "articles.json");

  if (fs.existsSync(authorPath)) {
    const author = JSON.parse(fs.readFileSync(authorPath, "utf8"));
    const { count } = await supabase
      .from("authors")
      .select("*", { count: "exact", head: true });

    if ((count ?? 0) === 0) {
      const seedAvatarUrl = getAvatarPublicUrl(url, DEFAULT_AVATAR_PATH);
      const { error } = await supabase.from("authors").insert({
        name: author.name,
        title: author.title,
        bio: author.bio,
        avatar_url: isLegacyLocalAvatar(author.avatar)
          ? seedAvatarUrl
          : author.avatar,
        avatar_updated_at: author.avatarUpdatedAt ?? null,
        location: author.location,
        email: author.email,
        social: author.social ?? {},
        skills: author.skills ?? [],
      });

      if (error) throw new Error(`作者迁移失败: ${error.message}`);
      console.log("✓ 作者数据已导入");
    } else {
      console.log("· 作者表已有数据，跳过");
    }
  }

  if (!fs.existsSync(articlesPath)) {
    console.log("未找到 data/articles.json，跳过文章迁移");
  } else {
    const articles = JSON.parse(fs.readFileSync(articlesPath, "utf8"));
    let imported = 0;
    let skipped = 0;

    for (const article of articles) {
      const { data: existing } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", article.slug)
        .maybeSingle();

      if (existing?.id) {
        skipped += 1;
        continue;
      }

      const { data: inserted, error } = await supabase
        .from("articles")
        .insert(mapArticleInsert(article))
        .select("id")
        .single();

      if (error) {
        throw new Error(`文章 ${article.slug} 迁移失败: ${error.message}`);
      }

      const blocks = mapBlocksInsert(inserted.id, article.content);
      if (blocks.length > 0) {
        const { error: blockError } = await supabase
          .from("article_blocks")
          .insert(blocks);
        if (blockError) {
          throw new Error(
            `文章 ${article.slug} 内容块迁移失败: ${blockError.message}`,
          );
        }
      }

      imported += 1;
      console.log(`✓ 已导入: ${article.slug}`);
    }

    console.log(`\n完成：导入 ${imported} 篇，跳过 ${skipped} 篇`);
  }

  await migrateAvatarToStorage(supabase, url);
}

migrate().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
