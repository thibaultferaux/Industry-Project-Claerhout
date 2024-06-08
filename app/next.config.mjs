/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    AZURE_MAPS_KEY: process.env.AZURE_MAPS_KEY,
  },
  output: 'standalone'
};

export default nextConfig;
