import { getWordPressFrontendData, WordPressPost, WordPressPage, WordPressTerm } from "@/lib/wordpress";
import Link from "next/link";

export default async function DynamicPage({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.page;
  let pageTitle = "";
  let subCategories: WordPressTerm[] = [];
  const categoryPostsMap: Record<number, WordPressPost[]> = {};

  try {
    const data = await getWordPressFrontendData();
    const allCategories = data?.rest?.categories || [];
    const allPosts = data?.rest?.posts || [];
    const pages = data?.rest?.pages || [];

    // 1. 동적으로 현재 슬러그(예: guide, news)와 일치하는 페이지 타이틀을 가져옵니다.
    const currentPage = pages.find((p: WordPressPage) => p.slug === currentSlug);
    if (currentPage) {
      pageTitle = currentPage.title.rendered;
    }

    // 2. 현재 슬러그(guide)와 일치하는 상위(부모) 카테고리를 찾습니다.
    const parentCategory = allCategories.find((cat: WordPressTerm) => cat.slug === currentSlug);
    if (parentCategory) {
      // 3. 해당 부모 카테고리에 속한 하위 카테고리들을 모두 찾습니다. (예: 붉은사막, GTA5)
      subCategories = allCategories.filter((cat: WordPressTerm) => cat.parent === parentCategory.id);

      // 4. 각 하위 카테고리별로 속한 글들을 분류합니다.
      subCategories.forEach((category) => {
        categoryPostsMap[category.id] = allPosts.filter((post: WordPressPost) => post.categories?.includes(category.id));
      });
    }
  } catch (error) {
    console.error("페이지를 가져오지 못했습니다. :", error);
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{pageTitle}</h1>

      <div className="flex flex-col gap-10">
        {subCategories.length === 0 && <p className="text-zinc-500">아직 등록된 컨텐츠가 없습니다.</p>}

        <ul className="flex flex-col gap-3">
          {subCategories.map((category) => (
            <li key={category.id} className="flex flex-col gap-4">
              {/* 주소는 /guide/글슬러그 형태가 되도록 설정합니다. */}
              <Link href={`/${currentSlug}/${category.slug}`} className="text-lg hover:text-blue-600 transition-colors">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
