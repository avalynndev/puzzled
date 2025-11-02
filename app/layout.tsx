import type { Metadata } from "next";
import "@/styles/globals.css";

import { Footer } from "@/components/footer";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: ["wordle", "crossword", "puzzles", "avalynndev"],
  authors: [
    {
      name: "avalynndev",
      url: "https://github.com/avalynndev",
    },
  ],
  creator: "avalynndev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: `${siteConfig.url}/manifest.json`,
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <div className="flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <main className="flex-1">{children}</main>
            <Footer />
            <TailwindIndicator />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
