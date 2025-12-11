import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your Norse Mythology profile and favorites",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
