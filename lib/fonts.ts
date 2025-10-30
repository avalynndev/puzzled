import { Grandstander, Roboto_Condensed, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const grandstander = Grandstander({
  subsets: ["vietnamese"],
  weight: ["400"],
  variable: "--font-grandstander",
});

export const robotoCondensed = Roboto_Condensed({
  subsets: ["vietnamese"],
  weight: ["200"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});
