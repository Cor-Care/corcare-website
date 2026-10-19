import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      // The portal is its own app on portal.thecorcare.com (live 19 Oct 2026);
      // this keeps old /portal links working. Temporary (307) so browsers
      // don't cache it forever.
      { source: "/portal", destination: "https://portal.thecorcare.com", permanent: false },
    ];
  },
};

export default nextConfig;
