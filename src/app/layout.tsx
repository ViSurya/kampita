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
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kampita",
    default: "Kampita - Download or Stream Millions of Songs for Free",
  },
  description: "Kampita offers a vast collection of music downloads and streaming. Enjoy high-quality songs, albums, and playlists at your fingertips. Download your favorite tracks from Kampita.",
  keywords: [
    "Kampita",
    "Music Downloads",
    "Free Song Download",
    "Kampita Song Download",
    "MP3 Download",
    "Latest Music",
    "Bollywood Songs",
    "Download Songs",
    "Hindi Songs",
    "Music Streaming",
    "Top Songs",
    "Free MP3 Song Download",
    "Kampita Music"
  ],
  openGraph: {
    title: "Kampita - Download or Stream Millions of Songs for Free",
    description: "Kampita offers a vast collection of music downloads and streaming. Enjoy high-quality songs, albums, and playlists at your fingertips. Download your favorite tracks from Kampita.",
    url: "https://pagal-world.site",
    type: "website",
    // images: [
    //   {
    //     url: "https://pagal-world.site/images/og-image.jpg",
    //     width: 800,
    //     height: 600,
    //     alt: "Kampita"
    //   }
    // ]
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://pagal-world.site",
  "name": "Kampita",
  "description": "Kampita offers a vast collection of music downloads and streaming. Enjoy high-quality songs, albums, and playlists at your fingertips. Download your favorite tracks from Kampita.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://pagal-world.site/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema)
          }}
        />
      </head>
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
