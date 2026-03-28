/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'zubericup.com' },
    ],
  },
};

export default nextConfig;
