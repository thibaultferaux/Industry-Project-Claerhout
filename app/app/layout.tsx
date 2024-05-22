import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoofRadar | Claerhout Aluminium",
  description: "An AI tool to detect flat roofs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={openSans.className}>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
