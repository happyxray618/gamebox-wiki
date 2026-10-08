import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/metadata";
import PublicPolicyLinks from "@/components/public-policy-links";
import { isIndexableDeployment } from "@/lib/public-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: isIndexableDeployment() ? { index: true, follow: true } : { index: false, follow: false },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  title: { default: "GAMEBOX.WIKI — Discover. Remember. Play.", template: "%s | GAMEBOX.WIKI" },
  description: "Discover great games across generations. Explore classics, cult favorites and hidden gems in the GAMEBOX game database and retro archive.",
  alternates: { canonical: "/" },
  openGraph: { title: "GAMEBOX.WIKI — Discover. Remember. Play.", description: "Discover classics, cult favorites and hidden gems across generations.", siteName: "GAMEBOX.WIKI", type: "website", url: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<PublicPolicyLinks /></body>
    </html>
  );
}
