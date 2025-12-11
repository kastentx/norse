import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/auth/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Norse Mythology Knowledge Base",
    template: "%s | Norse Mythology",
  },
  description:
    "Explore Norse mythology with interactive animations - gods, stories, and the Nine Realms",
  keywords: [
    "norse mythology",
    "vikings",
    "odin",
    "thor",
    "ragnarok",
    "nine realms",
    "freyja",
    "loki",
    "asgard",
    "valhalla",
  ],
  authors: [{ name: "Norse Mythology Knowledge Base" }],
  creator: "Norse Mythology Knowledge Base",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Norse Myths",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://norse-mythology.app",
    title: "Norse Mythology Knowledge Base",
    description: "Explore Norse mythology with interactive animations",
    siteName: "Norse Mythology Knowledge Base",
  },
  twitter: {
    card: "summary_large_image",
    title: "Norse Mythology Knowledge Base",
    description: "Explore Norse mythology with interactive animations",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-norse-night text-white antialiased">
        <SessionProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
