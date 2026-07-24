import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";

import { GrainOverlay } from "@/components/common/grain-overlay";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — trusted educators in ${SITE.location}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(manrope.variable, onest.variable, "antialiased")}
    >
      <body>
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
