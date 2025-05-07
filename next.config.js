const nextConfig = {
  experimental: { serverActions: true },
  reactStrictMode: true,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
    ],
  },
  async middleware() {
    return ['/api/:path*']; 
  },
};

module.exports = nextConfig;
