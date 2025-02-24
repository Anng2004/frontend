/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["frontend-production-6c2f.up.railway.app", "localhost"],
  },
  output: "standalone",
}

module.exports = nextConfig

