import type { MetadataRoute } from "next";
import { getWordPressFrontendData } from "@/lib/wordpress";

const SITE_URL = "https://gameinfohub.com";

function siteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: siteUrl(),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const data = await getWordPressFrontendData();
    const { pages, categories, posts } = data.rest;

    for (const page of pages) {
      urls.push({
        url: siteUrl(`/${page.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const parentCategory of categories.filter((category) => !category.parent)) {
      const parentPath = `/${parentCategory.slug}`;

      if (!urls.some((entry) => entry.url === siteUrl(parentPath))) {
        urls.push({
          url: siteUrl(parentPath),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      for (const childCategory of categories.filter((category) => category.parent === parentCategory.id)) {
        urls.push({
          url: siteUrl(`${parentPath}/${childCategory.slug}`),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });

        for (const post of posts.filter((post) => post.categories?.includes(childCategory.id))) {
          urls.push({
            url: siteUrl(`${parentPath}/${childCategory.slug}/${post.slug}`),
            lastModified: new Date(post.date),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    return urls;
  }

  return urls;
}
