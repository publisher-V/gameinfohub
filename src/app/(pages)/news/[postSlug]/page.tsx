import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatPostDate, getPostBySlug, getWordPressFrontendData, type WordPressPost, type WordPressTerm } from "@/lib/wordpress";

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function getPostDescription(post: WordPressPost) {
  return post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function getCategoryAndChildIds(categories: WordPressTerm[], parentSlug: string) {
  const parentCategory = categories.find((category) => category.slug === parentSlug && !category.parent);

  if (!parentCategory) {
    return [];
  }

  return [parentCategory.id, ...categories.filter((category) => category.parent === parentCategory.id).map((category) => category.id)];
}

function postBelongsToCategoryIds(post: WordPressPost, categoryIds: number[]) {
  return post.categories?.some((categoryId) => categoryIds.includes(categoryId)) ?? false;
}

export async function generateMetadata({ params }: { params: Promise<{ postSlug: string }> }): Promise<Metadata> {
  const { postSlug } = await params;
  const normalizedPostSlug = normalizeSlug(postSlug);

  try {
    const data = await getWordPressFrontendData();
    const newsCategoryIds = getCategoryAndChildIds(data.rest.categories, "news");
    const targetPost = data.rest.posts.find((post) => normalizeSlug(post.slug) === normalizedPostSlug && postBelongsToCategoryIds(post, newsCategoryIds));

    if (!targetPost) {
      return {
        title: "Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = targetPost.title.rendered;
    const description = getPostDescription(targetPost) || "Game Info Hub news post.";
    const url = `/news/${postSlug}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "article",
      },
    };
  } catch {
    return {
      title: "Game Info Hub",
    };
  }
}

export default async function NewsPostPage({ params }: { params: Promise<{ postSlug: string }> }) {
  const { postSlug } = await params;
  const normalizedPostSlug = normalizeSlug(postSlug);
  let targetPost: WordPressPost | undefined;

  try {
    const data = await getWordPressFrontendData();
    const newsCategoryIds = getCategoryAndChildIds(data.rest.categories, "news");

    if (newsCategoryIds.length === 0) {
      notFound();
    }

    targetPost = data.rest.posts.find((post) => normalizeSlug(post.slug) === normalizedPostSlug && postBelongsToCategoryIds(post, newsCategoryIds));

    if (!targetPost) {
      const post = await getPostBySlug(normalizedPostSlug);
      targetPost = post && postBelongsToCategoryIds(post, newsCategoryIds) ? post : undefined;
    }
  } catch (error) {
    console.error("Could not load news post data.", error);
    notFound();
  }

  if (!targetPost) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="border-b-1 border-zinc-600 pb-5">
        <h1 className="mb-2.5 text-center text-3xl font-bold text-[#222] dark:text-zinc-50 max-[769px]:text-2xl">{targetPost.title.rendered}</h1>
        <p className="text-right text-sm text-[#222]">{formatPostDate(targetPost.date)}</p>
      </div>
      {targetPost.content.rendered && <div className="wp-content" dangerouslySetInnerHTML={{ __html: targetPost.content.rendered }} />}
    </main>
  );
}
