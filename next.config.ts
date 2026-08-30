import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Handle subpath deployments (like GitHub Pages or custom proxies)
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
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
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
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
