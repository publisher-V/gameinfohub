import { getWordPressFrontendData, WordPressPage, WordPressTerm } from "@/lib/wordpress";
import Link from "next/link";

function getImageSizeUrl(size: string | { source_url?: string } | undefined) {
  if (typeof size === "string") {
    return size;
  }

  return size?.source_url;
}

function getCategoryThumbnailUrl(category: WordPressTerm, mediaItems: { id: number; source_url: string }[]) {
  const thumbnailData = category.acf?.thumbnail;

  if (!thumbnailData) {
    return "";
  }

  if (typeof thumbnailData === "string") {
    return thumbnailData;
  }

  if (typeof thumbnailData === "number") {
    return mediaItems.find((mediaItem) => mediaItem.id === thumbnailData)?.source_url ?? "";
  }

  return thumbnailData.url ?? thumbnailData.source_url ?? getImageSizeUrl(thumbnailData.sizes?.medium_large) ?? getImageSizeUrl(thumbnailData.sizes?.large) ?? getImageSizeUrl(thumbnailData.sizes?.full) ?? "";
}

export default async function DynamicPage({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.page;
  let pageTitle = "";
  let subCategories: WordPressTerm[] = [];
  let allMedia: { id: number; source_url: string }[] = [];

  try {
    const data = await getWordPressFrontendData();
    const allCategories = data?.rest?.categories || [];
    const pages = data?.rest?.pages || [];
    allMedia = data?.rest?.media || [];

    const currentPage = pages.find((page: WordPressPage) => page.slug === currentSlug);
    if (currentPage) {
      pageTitle = currentPage.title.rendered;
    }

    const parentCategory = allCategories.find((category: WordPressTerm) => category.slug === currentSlug);
    if (parentCategory) {
      subCategories = allCategories.filter((category: WordPressTerm) => category.parent === parentCategory.id);
    }
  } catch (error) {
    console.error("페이지 데이터를 가져오지 못했습니다:", error);
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{pageTitle}</h1>

      <div className="flex flex-col gap-10">
        {subCategories.length === 0 && <p className="text-zinc-500">아직 등록된 콘텐츠가 없습니다.</p>}

        <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {subCategories.map((category) => {
            const thumbnailUrl = getCategoryThumbnailUrl(category, allMedia);

            return (
              <li key={category.id} className="relative h-[0px] overflow-hidden rounded-xl bg-zinc-200 pt-[100%] shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-800">
                <Link
                  href={`/${currentSlug}/${category.slug}`}
                  className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-cover bg-center text-xl font-bold text-white transition-colors hover:text-blue-300"
                  style={{
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
