import type { NextConfig } from 'next';
import path from 'path';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Keeps local development isolated from stale production artifacts.
  distDir: '.next-local',
};
export default nextConfig;
