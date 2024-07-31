/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'c.saavncdn.com',
          port: '',
          pathname: '/**',
        },
      ],
  },
  redirects: async () => {
      return [
          {
              source: '/browse',
              destination: '/',
              permanent: false,
          },
          {
              source: '/settings',
              destination: '/',
              permanent: false,
          },
          {
              source: '/songs',
              destination: '/',
              permanent: false,
          }
      ];
  }
};

export default nextConfig;