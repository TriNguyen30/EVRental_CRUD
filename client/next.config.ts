// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // CẤU HÌNH CHO PHÉP TẢI ẢNH TỪ CÁC DOMAIN NGOÀI
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // CHO PHÉP TẤT CẢ DOMAIN HTTPS
      },
    ],
    // HOẶC CHỈ CHO PHÉP DOMAIN CỤ THỂ
    // domains: ["i.imgur.com", "media-cdn-v2.laodong.vn"],
  },
};

module.exports = nextConfig;
