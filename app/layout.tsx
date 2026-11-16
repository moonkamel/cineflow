import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { SocialBar } from "@/components/ads/SocialBar";
import { Popunder } from "@/components/ads/Popunder";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  <meta name="google-site-verification" content="DfVrzZNW9_vzH9rwKPMThm4LQvSO9HyKN2pTBsBxDj4" />
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Watch Trailers & Find Where to Stream Movies and TV Shows`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image" },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  // Enables the Google sitelinks search box
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`dark ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="" />
        <JsonLd data={websiteLd} />
      </head>
      <body className="min-h-svh font-sans">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        {/* Third-party ads: injected after hydration / on idle, never render-blocking */}
        <SocialBar />
        <Popunder />
      </body>
    </html>
  );
}
