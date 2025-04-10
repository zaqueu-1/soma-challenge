/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lojaanimale.vteximg.com.br',
        pathname: '/arquivos/ids/**',
      },
      {
        protocol: 'https',
        hostname: 'lojaanimale.vtexassets.com',
        pathname: '/**',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 