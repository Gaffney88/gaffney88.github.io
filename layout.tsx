import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eurotunnel Management",
  description: "Eurotunnel & E2 management dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}