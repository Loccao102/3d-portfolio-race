/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;

