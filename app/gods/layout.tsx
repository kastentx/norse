import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Norse Gods and Goddesses",
  description:
    "Explore the pantheon of Norse gods and goddesses including Odin, Thor, Freyja, and Loki. Learn about their domains, powers, family relationships, and sacred symbols.",
  openGraph: {
    title: "Norse Gods and Goddesses | Norse Mythology",
    description:
      "Discover the Aesir and Vanir gods of Norse mythology with detailed profiles, stunning visuals, and interactive explorations of their stories and symbols.",
    type: "website",
  },
  keywords: [
    "norse gods",
    "odin",
    "thor",
    "freyja",
    "loki",
    "aesir",
    "vanir",
    "norse deities",
  ],
};

export default function GodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
