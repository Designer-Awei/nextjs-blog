import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/**
 * 浏览器端 Supabase 客户端（Client Components 使用）
 */
export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createBrowserClient(url, publishableKey);
}
