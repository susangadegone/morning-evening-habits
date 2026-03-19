import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/morning-evening-habits',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
