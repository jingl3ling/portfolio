import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Ambient from "@/components/Ambient";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jing Huang — Engineer & Founder",
  description:
    "Jing Huang — web developer, AI M.S. @ NJIT, Computer Engineering B.S. I build systems where software meets the physical world and AI meets people.",
  openGraph: {
    title: "Jing Huang — Engineer & Founder",
    description:
      "Web developer & AI master's student. Biosensing hardware, full-stack web, AI, and ventures.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full">
        <Ambient />
        <Cursor />
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
