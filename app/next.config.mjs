/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    AZURE_MAPS_KEY: process.env.AZURE_MAPS_KEY,
    API_KEY: process.env.API_KEY
  }
};

export default nextConfig;
