import type { NextConfig } from "next";

// Next.js 실행 및 빌드 옵션을 설정합니다.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
