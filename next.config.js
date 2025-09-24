/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for compatibility
  images: {
    unoptimized: true,
  },
  // Set to true to disable static optimization
  reactStrictMode: true,
  swcMinify: true,
  // Disable static page generation for API routes
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
};

module.exports = nextConfig;
