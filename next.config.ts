import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:['ik.imagenkit.io' ,'i.ytimg.com']
  },
  experimental:{
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
