/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    // This is required to allow the Next.js dev server to be proxied in the
    // Firebase Studio environment.
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
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
