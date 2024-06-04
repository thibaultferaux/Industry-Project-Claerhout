import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

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
    <ReactQueryClientProvider>
      <html lang="nl">
        <body className={openSans.className}>
          <SiteLayout>{children}</SiteLayout>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
