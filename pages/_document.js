import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* General Sans is self-hosted (public/fonts) — see styles/globals.css
            @font-face. Avoids a third-party render-blocking request to
            Fontshare, which only negotiates TLS 1.2. JetBrains Mono for
            hashes, IDs, and data still loads from Google Fonts. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
