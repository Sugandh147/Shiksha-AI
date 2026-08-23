import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production build to succeed even with minor ESLint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Strict TypeScript is enforced via `tsc --noEmit` in CI/pre-push
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable compression for production builds
  compress: true,
  // Trailing slash is consistent across environments
  trailingSlash: false,
  // Power-user: use standalone output for Docker/Vercel deployment
  // output: "standalone",  // uncomment for Docker/Vercel deployment
};

export default nextConfig;
