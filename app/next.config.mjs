/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
  output: 'standalone'
};

export default nextConfig;
