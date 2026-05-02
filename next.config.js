/** @type {import('next').NextConfig} */
const nextConfig = {
  // Handle subpath deployments (like GitHub Pages or custom proxies)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  images: {
    domains: ['picsum.photos'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true // Often needed for static exports/subpaths
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Disable TypeScript checking for now
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
