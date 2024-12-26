await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "pub-73193c8c4696484cbefd31166c242e7a.r2.dev" },
      { hostname: "files.stripe.com" },
      { hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
