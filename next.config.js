/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
      }
    },
    {
      urlPattern: ({ request }) =>
        ["script", "style", "image", "font"].includes(request.destination),
      handler: "CacheFirst",
      options: {
        cacheName: "static-cache",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      }
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith("/api"),
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
      }
    }
  ]
});

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      }
    ],
  },
};

module.exports = withPWA(nextConfig);
