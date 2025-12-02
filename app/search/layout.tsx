import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Norse Mythology",
  description:
    "Search across all gods, stories, and realms in our Norse mythology knowledge base. Filter by type, domain, and difficulty to find exactly what you're looking for.",
  openGraph: {
    title: "Search Norse Mythology | Norse Mythology Knowledge Base",
    description:
      "Search and filter through our comprehensive collection of Norse gods, epic stories, and the Nine Realms.",
    type: "website",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
