/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/zod",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
