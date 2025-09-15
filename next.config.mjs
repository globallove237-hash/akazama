/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Fix for Prisma client issues in production
  webpack: (config) => {
    config.externals.push('@prisma/client', '.prisma/client')
    return config
  },
}

export default nextConfig
