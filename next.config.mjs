/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // B-6: Security headers on every dashboard response.
  // Next.js pages router uses inline scripts and styles, so script-src and
  // style-src need 'unsafe-inline'. This is unfortunate but unavoidable without
  // a full migration to nonce-based CSP (complex, lower priority).
  //
  // The most important protections here are:
  //   frame-ancestors 'none' — prevents clickjacking via <iframe> embedding
  //   connect-src            — limits fetch() targets to known endpoints
  //   img-src                — prevents data-exfil via tracking pixels
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js injects inline scripts; unsafe-inline is required for pages router
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Inline React styles + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts actual font files
      "font-src 'self' https://fonts.gstatic.com",
      // Logo is now bundled locally (public/aidal-logo*.png) — no more
      // cross-origin hotlink to tryaidal.com, so 'self' alone covers it.
      "img-src 'self' data: https://flagcdn.com",
      // Railway API, Formspree (signup notification), and the GitHub API
      // (transparency page lists the public anchors repo's contents)
      "connect-src 'self' https://aidal-production.up.railway.app https://formspree.io https://api.github.com",
      // No <object>, <embed>, or <applet>
      "object-src 'none'",
      // Prevent this page from being embedded in an iframe on any other origin
      "frame-ancestors 'none'",
      // Only send Referer on same-origin requests
      "referrer strict-origin-when-cross-origin",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy",   value: csp },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "geolocation=(), microphone=(), camera=(), payment=()" },
          // HSTS is set by Railway/Vercel at the edge — adding here as belt-and-suspenders
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
