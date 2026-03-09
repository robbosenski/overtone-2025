import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-P58KZKB6";

const electricBlue = localFont({
  src: [
    { path: "../public/fonts/ElectricBlue-VF.woff2", style: "normal" },
  ],
  variable: "--font-header",
  display: "swap",
});

const helveticaCond = localFont({
  src: [
    { path: "../public/fonts/NeueHelveticaPro-57Condensed.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/NeueHelveticaPro-57Condensed.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Overtone Festival 2025 — Musgrave Park, Gold Coast",
  description:
    "A new open-air electronic festival curated by Mode Festival & CYBER. Two stages in Musgrave Park — Sun 12 Oct 2025.",
  openGraph: {
    title: "Overtone Festival 2025 — Musgrave Park, Gold Coast",
    description:
      "A new open-air electronic festival curated by Mode Festival & CYBER. Two stages in Musgrave Park — Sun 12 Oct 2025.",
    url: "https://overtonefestival.com",
    type: "website",
    images: ["/brand/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Overtone Festival 2025 — Musgrave Park, Gold Coast",
    description:
      "A new open-air electronic festival curated by Mode Festival & CYBER. Two stages in Musgrave Park — Sun 12 Oct 2025.",
    images: ["/brand/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon/favicon.ico" }
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/favicon/site.webmanifest" }
    ]
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body className={`${electricBlue.variable} ${helveticaCond.variable} antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
