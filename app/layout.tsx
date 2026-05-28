import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import TopVisual from "@/components/top-visual/top-visual";
import PressStart from "@/components/press-start/press-start";

const siteUrl = "https://www.gameinfohub.com";
const siteName = "Game Info Hub";
const description = "각종 게임의 소식과 공략 정보를 한곳에서 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  applicationName: siteName,
  description,
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteName,
    description,
  },
  twitter: {
    card: "summary",
    title: siteName,
    description,
  },
  appleWebApp: {
    title: siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/neodgm/neodgm-webfont@1.601/neodgm/style.css" precedence="default" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/neodgm/neodgm-webfont@1.601/neodgm_code/style.css" precedence="default" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=skull" precedence="default" />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PressStart />
        <section id="bodyContainer" className="flex-1 flex flex-col border-2 border-[#702a1a] rounded-[2rem] radius-[2rem]">
          <TopVisual />
          <Header />
          {children}
          <Footer />
        </section>
      </body>
    </html>
  );
}
