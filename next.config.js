/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // placehold.co (seed/demo images) serves SVG — allow only for trusted placeholder URLs
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Clickjacking protection
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // XSS protection (legacy browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Permissions policy — disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src * data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.resend.com https://*.vercel.app https://*.neon.tech",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // Strict Transport Security (1 year, includes subdomains)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      // API routes: prevent caching of sensitive responses
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
