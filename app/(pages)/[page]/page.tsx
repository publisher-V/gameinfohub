import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordPressFrontendData, WordPressPage, WordPressPost, WordPressTerm } from "@/lib/wordpress";

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

function countPostsInCategory(posts: WordPressPost[], categoryId: number) {
  return posts.filter((post) => post.categories?.includes(categoryId)).length;
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page: currentSlug } = await params;

  try {
    const data = await getWordPressFrontendData();
    const currentPage = data.rest.pages.find((page) => page.slug === currentSlug);
    const parentCategory = data.rest.categories.find((category) => category.slug === currentSlug && !category.parent);

    if (!currentPage && !parentCategory) {
      return {
        title: "Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = currentPage?.title.rendered ?? parentCategory?.name ?? "Game Info Hub";
    const description = parentCategory?.description || "Game Info Hub의 게임 소식과 공략 글을 확인하세요.";

    return {
      title,
      description,
      alternates: {
        canonical: `/${currentSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `/${currentSlug}`,
      },
    };
  } catch {
    return {
      title: "Game Info Hub",
    };
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.page;
  let pageTitle = "";
  let subCategories: WordPressTerm[] = [];
  let posts: WordPressPost[] = [];
  let allMedia: { id: number; source_url: string }[] = [];

  try {
    const data = await getWordPressFrontendData();
    const allCategories = data?.rest?.categories || [];
    const pages = data?.rest?.pages || [];
    allMedia = data?.rest?.media || [];
    posts = data?.rest?.posts || [];

    const currentPage = pages.find((page: WordPressPage) => page.slug === currentSlug);
    const parentCategory = allCategories.find((category: WordPressTerm) => category.slug === currentSlug && !category.parent);

    if (!currentPage && !parentCategory) {
      notFound();
    }

    pageTitle = currentPage?.title.rendered ?? parentCategory?.name ?? "";

    if (parentCategory) {
      subCategories = allCategories.filter((category: WordPressTerm) => category.parent === parentCategory.id);
    }
  } catch (error) {
    console.error("Could not load page data.", error);
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{pageTitle}</h1>

      <div className="flex flex-col gap-10">
        {subCategories.length === 0 && <p className="text-zinc-500">아직 등록된 콘텐츠가 없습니다.</p>}

        <ul className="grid grid-cols-4 gap-5 max-[769px]:grid-cols-1 max-[1261px]:grid-cols-2">
          {subCategories.map((category) => {
            const thumbnailUrl = getCategoryThumbnailUrl(category, allMedia);
            const postCount = countPostsInCategory(posts, category.id);

            return (
              <li key={category.id} className="relative overflow-hidden border-2 border-b-[#4a4a4a] border-l-[#eee] border-r-[#4a4a4a] border-t-[#eee] bg-[#cacac5] shadow-[inset_1px_1px_0_#eee,inset_-3px_-3px_0_#777]">
                <div className="box-border h-full w-full bg-cover bg-center p-4 text-xl font-bold text-white transition-colors">
                  <div className="mb-3 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-black text-[16px]">{category.name}</p>
                    <p className="text-black text-[16px]">작성된 글 : {postCount}개</p>
                  </div>

                  <div className="mb-3 flex w-full flex-col gap-3 md:flex-row">
                    {thumbnailUrl && (
                      <figure className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image src={thumbnailUrl} alt={category.name} fill className="object-cover" />
                      </figure>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href={`/${currentSlug}/${category.slug}`}
                      className="box-border inline-flex h-7 min-w-[92px] items-center justify-center border border-b-[#5f5f5f] border-l-[#f5f5f5] border-r-[#5f5f5f] border-t-[#f5f5f5] bg-[#c0c0c0] px-3 text-[13px] font-bold text-black shadow-[inset_1px_1px_0_#eee,inset_-1px_-1px_0_#9a9a9a] hover:bg-[#cfcfcf] active:border-b-[#f5f5f5] active:border-l-[#5f5f5f] active:border-r-[#f5f5f5] active:border-t-[#5f5f5f] active:shadow-[inset_1px_1px_0_#8a8a8a]"
                    >
                      자세히 보기
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
