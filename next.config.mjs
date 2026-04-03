/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Required in this sandbox: the workspace root differs from the app directory,
    // so Next.js cannot find its own package without this explicit pointer.
    root: process.cwd(),
  },
}

export default nextConfig
