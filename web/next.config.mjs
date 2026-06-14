/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export so the site can be hosted on GitHub Pages (no server).
  output: "export",

  // Served from https://<user>.github.io/fresh_bbb_shop/, so prefix routes/assets.
  basePath: "/fresh_bbb_shop",
  assetPrefix: "/fresh_bbb_shop",
  trailingSlash: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },

  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
