import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Norse Mythology Knowledge Base",
  description: "Explore the gods, stories, and realms of Norse mythology",
  keywords: ["norse mythology", "vikings", "odin", "thor", "ragnarok", "nine realms"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
