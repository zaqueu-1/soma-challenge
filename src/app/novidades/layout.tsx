import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novidades | Animale",
  description: "Confira as novidades da Animale",
};

export default function NovidadesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 