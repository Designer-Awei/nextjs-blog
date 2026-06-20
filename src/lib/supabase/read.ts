import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * 创建 Supabase 数据客户端（Publishable Key，公开读写）
 * 本项目不做登录/角色区分，RLS 已开放匿名读写
 */
export function createSupabaseReadClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
