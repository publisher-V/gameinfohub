import type { MetadataRoute } from "next";

const description = "각종 게임의 소식과 공략 정보를 한곳에서 확인하세요.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Game Info Hub",
    short_name: "Game Info Hub",
    description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f1e8",
    theme_color: "#702a1a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
