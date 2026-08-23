import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for production builds
  compress: true,
  // Trailing slash is consistent across environments
  trailingSlash: false,
  // Disable AI agent file auto-generation
  agentRules: false,
};

export default nextConfig;
