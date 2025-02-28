import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: ["**/server/**"], // Prevents Next.js from restarting on server file changes
      };
    }
    return config;
  },
};

export default nextConfig;
