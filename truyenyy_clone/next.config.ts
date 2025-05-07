// next.config.ts
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.16.104:3000'],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'http://192.168.1.100:8080', // thay bằng IP của bạn
  },


};

export default nextConfig;