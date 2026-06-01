import type { NextConfig } from "next";
import path from "node:path";

// ตั้ง GITHUB_PAGES=true ตอน build เพื่อ export เป็น static สำหรับ GitHub Pages
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "punnett-square";

const nextConfig: NextConfig = {
  // กำหนด root ให้ตรงกับโปรเจกต์นี้ (มี lockfile ของ parent อยู่ด้วย)
  turbopack: {
    root: path.resolve(__dirname),
  },
  ...(isPages
    ? {
        output: "export" as const,
        basePath: `/${repo}`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
