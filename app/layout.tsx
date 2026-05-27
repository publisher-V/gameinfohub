import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import TopVisual from "@/components/top-visual/top-visual";
import PressStart from "@/components/press-start/press-start";

const description = "각종 게임의 소식과 공략 정보를 한곳에서 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gameinfohub.com"),
  title: {
    default: "Game Info Hub",
    template: "%s | Game Info Hub",
  },
  applicationName: "Game Info Hub",
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
    url: "https://www.gameinfohub.com/",
    siteName: "Game Info Hub",
    title: "Game Info Hub",
    description,
  },
  twitter: {
    card: "summary",
    title: "Game Info Hub",
    description,
  },
  appleWebApp: {
    title: "Game Info Hub",
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
