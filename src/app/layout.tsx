import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroSnap 80 - Vintage Instant Film Camera",
  description:
    "Tactile retro instant film camera web app with analog film presets, physical camera controls, photo developing animation, and vintage Polaroid-style prints.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RetroSnap 80",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f7f3eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased overflow-hidden select-none bg-[#141210]">
        {children}
      </body>
    </html>
  );
}
