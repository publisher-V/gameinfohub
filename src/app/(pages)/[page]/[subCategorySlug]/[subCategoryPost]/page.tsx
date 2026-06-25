import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatPostDate, getPostBySlug, getWordPressFrontendData, WordPressPost } from "@/lib/wordpress";

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

export async function generateMetadata({ params }: { params: Promise<{ page: string; subCategorySlug: string; subCategoryPost: string }> }): Promise<Metadata> {
  const subCategoryParams = await params;
  const normalizedPostSlug = normalizeSlug(subCategoryParams.subCategoryPost);

  try {
    const data = await getWordPressFrontendData();
    const parentCategory = data.rest.categories.find((category) => category.slug === subCategoryParams.page && !category.parent);
    const targetCategory = data.rest.categories.find((category) => category.slug === subCategoryParams.subCategorySlug && category.parent === parentCategory?.id);
    const targetPost = data.rest.posts.find((post) => normalizeSlug(post.slug) === normalizedPostSlug && Boolean(targetCategory && post.categories?.includes(targetCategory.id)));

    if (!parentCategory || !targetCategory || !targetPost) {
      return {
        title: "Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = targetPost.title.rendered;
    const description = getPostDescription(targetPost) || "Game Info Hub에서 게임 게시글을 확인하세요.";
    const url = `/${subCategoryParams.page}/${subCategoryParams.subCategorySlug}/${subCategoryParams.subCategoryPost}`;

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

export default async function SubCategoryPostPage({ params }: { params: Promise<{ page: string; subCategorySlug: string; subCategoryPost: string }> }) {
  const subCategoryParams = await params;
  const pageSlug = subCategoryParams.page;
  const subCategorySlug = subCategoryParams.subCategorySlug;
  const subCategoryPost = subCategoryParams.subCategoryPost;

  let targetPost: WordPressPost | undefined;

  try {
    const data = await getWordPressFrontendData();
    const normalizedSubCategoryPost = normalizeSlug(subCategoryPost);
    const parentCategory = data.rest.categories.find((category) => category.slug === pageSlug && !category.parent);
    const targetCategory = data.rest.categories.find((category) => category.slug === subCategorySlug && category.parent === parentCategory?.id);

    if (!parentCategory || !targetCategory) {
      notFound();
    }

    targetPost = data?.rest?.posts?.find((post) => normalizeSlug(post.slug) === normalizedSubCategoryPost && post.categories?.includes(targetCategory.id));

    if (!targetPost) {
      const post = await getPostBySlug(normalizedSubCategoryPost);
      targetPost = post?.categories?.includes(targetCategory.id) ? post : undefined;
    }
  } catch (error) {
    console.error("Could not load post data.", error);
    notFound();
  }

  if (!targetPost) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="border-b-1 pb-5 border-zinc-600">
        <h1 className="text-3xl font-bold text-center text-[#222] dark:text-zinc-50 max-[769px]:text-2xl mb-2.5">{targetPost.title.rendered}</h1>
        <p className="text-sm text-[#222] text-right">{formatPostDate(targetPost.date)}</p>
      </div>
      {targetPost.content.rendered && <div className="wp-content" dangerouslySetInnerHTML={{ __html: targetPost.content.rendered }} />}
    </main>
  );
}
