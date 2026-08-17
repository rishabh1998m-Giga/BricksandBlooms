import type { Metadata } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ScrollRefresh from "@/components/ScrollRefresh";
import WorldCanvas from "@/components/webgl/WorldCanvas";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Brick & Blooms — A new way of living",
  description:
    "Brick & Blooms: Architects | Interiors | Landscape. Transforming outdoor spaces with thoughtful landscape design & execution.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable}`}>
      <body>
        <ScrollRefresh />
        <WorldCanvas />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
