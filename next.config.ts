import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Handle subpath deployments (like GitHub Pages or custom proxies)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        // SimpleIcons CDN used for tech skill logos in SkillsSection
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    // Strip console.* calls in production builds
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // TypeScript errors are now surfaced during build (was ignored before)
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
