import type { NextConfig } from "next";

const baseDomain = process.env.BASE_DOMAIN || process.env.NEXT_PUBLIC_BASE_DOMAIN || 'sparkco.localhost';
const backendUrl = process.env.NEXT_PUBLIC_API_URL || `http://api.book.${baseDomain}`;

type ImageRemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

function buildImageRemotePatterns(): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = [];

  const add = (p: ImageRemotePattern) => {
    patterns.push({ pathname: "/**", ...p });
  };

  try {
    const u = new URL(backendUrl);
    add({
      protocol: u.protocol === "https:" ? "https" : "http",
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
    });
  } catch {
    // Invalid NEXT_PUBLIC_API_URL; rely on localhost / baseDomain patterns below.
  }

  for (const protocol of ["http", "https"] as const) {
    add({ protocol, hostname: "localhost" });
    add({ protocol, hostname: "127.0.0.1" });
  }

  if (baseDomain && !baseDomain.includes("/")) {
    for (const protocol of ["http", "https"] as const) {
      add({ protocol, hostname: baseDomain });
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: buildImageRemotePatterns(),
  },

  experimental: {
    serverActions: {},
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`, // backend
      },
    ];
  },


};

export default nextConfig;
