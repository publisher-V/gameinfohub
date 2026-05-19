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
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{pageTitle}</h1>

      <div className="flex flex-col gap-10">
        {subCategories.length === 0 && <p className="text-zinc-500">아직 등록된 컨텐츠가 없습니다.</p>}

        <ul className="grid gap-5 grid-cols-2 md:grid-cols-4">
          {subCategories.map((category) => {
            // ACF 이미지 설정에 따라 텍스트(URL)로 올 수도 있고 객체로 올 수도 있으므로 둘 다 대응합니다.
            const thumbnailData = category.acf?.thumbnail;
            const thumbnailUrl = typeof thumbnailData === "string" ? thumbnailData : thumbnailData?.url || "";

            return (
              <li key={category.id} className="relative h-[0px] pt-[100%] bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link
                  href={`/${currentSlug}/${category.slug}`}
                  className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-xl font-bold text-white hover:text-blue-300 transition-colors bg-cover bg-center"
                  style={{
                    // 이미지가 있으면 어두운 필터를 깔아서 글씨가 잘 보이게 합니다. 없으면 빈 배경
                    backgroundImage: thumbnailUrl ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${thumbnailUrl}')` : "none",
                  }}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
