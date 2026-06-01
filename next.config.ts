import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // กำหนด root ให้ตรงกับโปรเจกต์นี้ (มี lockfile ของ parent อยู่ด้วย)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
