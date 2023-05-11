/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        port: '',
        pathname: '/steam/apps/**',
      },
    ],
  },
}

module.exports = nextConfig
