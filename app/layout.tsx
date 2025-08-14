import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${electricBlue.variable} ${helveticaCond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
