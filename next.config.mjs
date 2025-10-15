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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'mongodb': false,
        'mongodb-client-encryption': false,
        '@mongodb-js/zstd': false,
        'snappy': false,
        'kerberos': false,
        '@aws-sdk/credential-providers': false,
        'gcp-metadata': false,
        'socks': false,
      };
    }
    return config; // Always return the config object
  },
};

export default nextConfig;
