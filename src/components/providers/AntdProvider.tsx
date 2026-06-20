"use client";

import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import type { ReactNode } from "react";

interface AntdProviderProps {
  children: ReactNode;
}

/**
 * Ant Design 全局配置 — 站酷黄主题
 */
export function AntdProvider({ children }: AntdProviderProps) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#ffe300",
          colorLink: "#222222",
          colorText: "#222222",
          colorTextSecondary: "#999999",
          colorBgLayout: "#f4f4f4",
          colorBgContainer: "#ffffff",
          colorBorder: "#e8e8e8",
          borderRadius: 4,
          fontFamily:
            'var(--font-inter), -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Button: {
            primaryColor: "#222222",
            colorPrimaryHover: "#ffd000",
            colorPrimaryActive: "#f5c800",
            defaultBorderColor: "#e8e8e8",
          },
          Tag: {
            defaultBg: "#f4f4f4",
            defaultColor: "#666666",
          },
          Card: {
            borderRadiusLG: 4,
          },
          Input: {
            borderRadius: 4,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
