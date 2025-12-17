import "./globals.css";
import type { Metadata } from "next";
import LayoutClient from "./appLayout";

export const metadata: Metadata = {
  title: "EV Rental System",
  description: "Admin dashboard for EV Rental management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
