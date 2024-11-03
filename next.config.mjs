/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    serverActions: true, // Enable Server Actions feature flag
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
