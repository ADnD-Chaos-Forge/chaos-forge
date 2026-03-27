import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chaos Forge — AD&D 2nd Edition Manager",
  description: "Charakter-Manager und Session-Tracker für Advanced Dungeons & Dragons 2nd Edition.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cinzel.variable} ${crimsonText.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <header className="flex items-center justify-center border-b border-border px-4 py-2 sm:px-6 sm:py-4">
              <Link href="/">
                <Image
                  src="/header-logo.webp"
                  alt="Chaos Forge"
                  width={280}
                  height={120}
                  priority
                  className="h-14 w-auto sm:h-28"
                />
              </Link>
            </header>

            <main className="flex flex-1 flex-col pb-16 sm:pb-0">{children}</main>

            <footer className="hidden flex-col items-center gap-2 border-t border-border px-6 py-6 sm:flex">
              <Image
                src="/footer-logo.webp"
                alt="Chaos Forge — Est. 2nd Ed."
                width={200}
                height={100}
                className="h-12 w-auto opacity-70"
              />
              <p className="text-xs text-muted-foreground">Chaos RPG — AD&D 2nd Edition</p>
            </footer>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
