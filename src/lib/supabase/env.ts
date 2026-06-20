/**
 * 读取 Supabase 环境变量
 * @throws 缺少配置时在开发环境抛出明确错误
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "缺少 Supabase 配置，请在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return { url, publishableKey };
}
