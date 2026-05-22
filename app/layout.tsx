import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import TopVisual from "@/components/top-visual/top-visual";

export const metadata: Metadata = {
  title: "Game Info Hub",
  applicationName: "Game Info Hub",
  description: "각종 게임의 소식을 접해보세요.",
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/neodgm/neodgm-webfont@1.601/neodgm/style.css" precedence="default" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/neodgm/neodgm-webfont@1.601/neodgm_code/style.css" precedence="default" />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TopVisual />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
