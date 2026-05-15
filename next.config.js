/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignoriert TypeScript-Fehler während des Builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoriert ESLint-Fehler während des Builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
