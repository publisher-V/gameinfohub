import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordPressFrontendData, WordPressPost, WordPressTerm } from "@/lib/wordpress";

export async function generateMetadata({ params }: { params: Promise<{ page: string; subCategorySlug: string }> }): Promise<Metadata> {
  const { page: pageSlug, subCategorySlug } = await params;

  try {
    const data = await getWordPressFrontendData();
    const parentCategory = data.rest.categories.find((category) => category.slug === pageSlug && !category.parent);
    const targetCategory = data.rest.categories.find((category) => category.slug === subCategorySlug && category.parent === parentCategory?.id);

    if (!parentCategory || !targetCategory) {
      return {
        title: "Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const description = targetCategory.description || `${targetCategory.name} 카테고리의 게임 글을 확인하세요.`;

    return {
      title: targetCategory.name,
      description,
      alternates: {
        canonical: `/${pageSlug}/${subCategorySlug}`,
      },
      openGraph: {
        title: targetCategory.name,
        description,
        url: `/${pageSlug}/${subCategorySlug}`,
      },
    };
  } catch {
    return {
      title: "Game Info Hub",
    };
  }
}

export default async function SubCategoryGuidePage({ params }: { params: Promise<{ page: string; subCategorySlug: string }> }) {
  const subCategoryParams = await params;
  const pageSlug = subCategoryParams.page;
  const subCategorySlug = subCategoryParams.subCategorySlug;

  let parentCategory: WordPressTerm | undefined;
  let targetCategory: WordPressTerm | undefined;
  let posts: WordPressPost[] = [];

  try {
    const data = await getWordPressFrontendData();
    parentCategory = data.rest.categories.find((cat) => cat.slug === pageSlug && !cat.parent);
    targetCategory = data.rest.categories.find((cat) => cat.slug === subCategorySlug && cat.parent === parentCategory?.id);

    posts = data.rest.posts.filter((post) => {
      if (!targetCategory) return false;
      return post.categories?.includes(targetCategory.id);
    });
  } catch (error) {
    console.error("Could not load category data.", error);
    notFound();
  }

  if (!parentCategory || !targetCategory) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{targetCategory.name}</h1>
      {targetCategory.description && <p className="text-zinc-600 dark:text-zinc-400">{targetCategory.description}</p>}

      <ul className="mt-4 flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <Link href={`/${pageSlug}/${targetCategory.slug}/${post.slug}`} className="group flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">{post.title.rendered}</h2>
              <div className="line-clamp-2 text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </Link>
          </li>
        ))}
        {posts.length === 0 && <p className="text-zinc-500">아직 작성된 글이 없습니다.</p>}
      </ul>
    </main>
  );
}
