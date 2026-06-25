import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatPostDate, getWordPressFrontendData, type WordPressPost, type WordPressTerm } from "@/lib/wordpress";

function getCategoryAndChildIds(categories: WordPressTerm[], parentSlug: string) {
  const parentCategory = categories.find((category) => category.slug === parentSlug && !category.parent);

  if (!parentCategory) {
    return [];
  }

  return [parentCategory.id, ...categories.filter((category) => category.parent === parentCategory.id).map((category) => category.id)];
}

function getPostsByCategoryIds(posts: WordPressPost[], categoryIds: number[]) {
  return posts.filter((post) => post.categories?.some((categoryId) => categoryIds.includes(categoryId)));
}

export const metadata: Metadata = {
  title: "News",
  description: "Game Info Hub news posts.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "News",
    description: "Game Info Hub news posts.",
    url: "/news",
  },
};

export default async function NewsPage() {
  let posts: WordPressPost[] = [];

  try {
    const data = await getWordPressFrontendData();
    const newsCategoryIds = getCategoryAndChildIds(data.rest.categories, "news");

    if (newsCategoryIds.length === 0) {
      notFound();
    }

    posts = getPostsByCategoryIds(data.rest.posts, newsCategoryIds);
  } catch (error) {
    console.error("Could not load news data.", error);
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <h1 className="text-3xl font-bold text-[#222] dark:text-zinc-50">News</h1>

      <ul className="mt-4 flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.id} className="border-t-1 py-4 dark:border-zinc-800">
            <Link href={`/news/${post.slug}`} className="group flex flex-col gap-2">
              <h2 className="line-clamp-1 text-2xl font-bold text-[#222] group-hover:text-[#702a1a] dark:text-zinc-50 dark:group-hover:text-blue-400">{post.title.rendered}</h2>
              <div className="line-clamp-2 text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              <p className="text-sm text-[#222]">{formatPostDate(post.date)}</p>
            </Link>
          </li>
        ))}
        {posts.length === 0 && <p className="text-zinc-500">No news posts found.</p>}
      </ul>
    </main>
  );
}
