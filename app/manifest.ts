import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    orientation: "portrait-primary",
    categories: ["productivity", "games", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/images/img-one.png",
        sizes: "640x320",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/images/img-two.png",
        sizes: "640x320",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/images/img-three.png",
        sizes: "640x320",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
