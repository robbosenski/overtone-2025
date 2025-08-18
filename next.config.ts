import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/e4rly',
        destination: 'https://moshtix.com.au/v2/event/overtone-festival-2025/184344?skin=OTF25&offercode=OTFPRESALE25',
        permanent: false, // Use false for temporary redirect (302), true for permanent (301)
      },
    ];
  },
};

export default nextConfig;
