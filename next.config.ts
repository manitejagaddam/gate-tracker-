import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "gate-tracker-";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : isProd
    ? `/${repoName}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
