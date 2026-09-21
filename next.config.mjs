// Task: Next.js core configuration file.
// Used by: Used by the Next.js runtime and build process.
// Important code snippets:
// 1. Base Next.js config export
// 2. Project settings for runtime behavior
// 3. Build configuration

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
