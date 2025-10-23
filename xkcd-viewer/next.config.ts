import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'imgs.xkcd.com',
                port: '',
                pathname: '/comics/**',
            },
        ],
    },
};

export default nextConfig;