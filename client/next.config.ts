import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
        ],
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/main/dashboard',
          has: [
            {
              type: 'host',
              value: 'app.localhost:3000',
            },
          ],
        },
        {
          source: '/',
          destination: '/auth/sign-in',
          has: [
            {
              type: 'host',
              value: 'accounts.localhost:3000',
            },
          ],
        }
      ],
      afterFiles: [],
      fallback: []
    };
  },
};

export default nextConfig;
