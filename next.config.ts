import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@remotion/renderer", "@remotion/bundler", "remotion"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    /** 代理环境下 Unsplash 可能解析到 198.18.x.x，需允许本地 IP 拉取图片 */
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
