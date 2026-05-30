import type { Metadata } from "next";
import { JetBrains_Mono, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/logo.png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-mono",
        jetbrainsMono.variable,
        caveat.variable,
      )}
      suppressHydrationWarning
    >
      <Analytics />
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
