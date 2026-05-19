import { getWordPressFrontendData, WordPressTerm, WordPressPost } from "@/lib/wordpress";
import Link from "next/link";

export default async function SubCategoryGuidePage({ params }: { params: Promise<{ subCategorySlug: string }> }) {
  // URL에서 전달된 동적 파라미터(slug)를 가져옵니다.
  const subCategoryParams = await params;
  const subCategorySlug = subCategoryParams.subCategorySlug;

  let targetCategory: WordPressTerm | undefined;
  let posts: WordPressPost[] = [];

  try {
    const data = await getWordPressFrontendData();
    // 1. URL의 슬러그와 일치하는 카테고리를 동적으로 찾습니다.
    targetCategory = data.rest.categories.find((cat) => cat.slug === subCategorySlug);

    // 2. 해당 카테고리에 속한 포스트만 필터링합니다.
    posts = data.rest.posts.filter((post) => {
      if (!targetCategory) return false;
      return post.categories?.includes(targetCategory.id);
    });

    if (!targetCategory) {
      return (
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">카테고리를 찾을 수 없습니다.</h1>
        </main>
      );
    }
  } catch (error) {
    console.error("페이지를 가져오지 못했습니다. :", error);
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      {/* 하드코딩된 텍스트 대신 동적으로 카테고리 이름을 렌더링합니다 */}
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{targetCategory.name}</h1>
      {targetCategory.description && <p className="text-zinc-600 dark:text-zinc-400">{targetCategory.description}</p>}

      <ul className="flex flex-col gap-6 mt-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
            {/* 포스트 상세 페이지로 이동하는 링크 (현재는 임시로 /slug) */}
            <Link href={`${targetCategory?.slug}/${post.slug}`} className="group flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">{post.title.rendered}</h2>
              <div className="text-zinc-600 line-clamp-2 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </Link>
          </li>
        ))}
        {posts.length === 0 && <p className="text-zinc-500">아직 작성된 글이 없습니다.</p>}
      </ul>
    </main>
  );
}
