/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    serverActions: true,
  },
  serverExternalPackages: ["@node-rs/argon2"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader', // Use node-loader to handle .node files
    });
    return config;
  },
};

export default nextConfig;
