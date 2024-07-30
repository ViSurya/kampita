import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Signika_Negative } from "next/font/google";
import "./globals.css";
import MainMenu from "@/components/layout/main-menu";
import { ThemeProvider } from "@/components/layout/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import { Player } from "@/components/Player/Player";
import { AudioProvider } from "./contexts/AudioContext";
import { Toaster } from "@/components/ui/toaster";


const globalFont = Signika_Negative({
  subsets: ["vietnamese"],
  weight: ["400", "700"], // You can add different weights if needed
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kampita",
    default: "Kampita - Feel the Beat, Free the Music",
  },
  description: "Kampita Music: Download and stream unlimited songs for free. Instant access to millions of tracks across all genres. No fees, no limits - just pure music enjoyment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          globalFont.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          <AudioProvider>
            <MainMenu />
            {children}
            <Player />
          </AudioProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
