import { getPostBySlug, getWordPressFrontendData, WordPressPost } from "@/lib/wordpress";

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export default async function SubCategoryPostPage({ params }: { params: Promise<{ subCategoryPost: string }> }) {
  const subCategoryParams = await params;
  const subCategoryPost = subCategoryParams.subCategoryPost;

  let targetPost: WordPressPost | undefined;

  try {
    const data = await getWordPressFrontendData();
    const normalizedSubCategoryPost = normalizeSlug(subCategoryPost);

    targetPost = data?.rest?.posts?.find((post) => normalizeSlug(post.slug) === normalizedSubCategoryPost);

    if (!targetPost) {
      targetPost = (await getPostBySlug(normalizedSubCategoryPost)) ?? undefined;
    }
  } catch (error) {
    console.error("포스트를 가져오지 못했습니다. :", error);
    return null;
  }

  if (!targetPost) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">포스트를 찾을 수 없습니다.</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <h1 className="text-3xl font-bold text-center text-zinc-950 dark:text-zinc-50 max-[769px]:text-2xl">{targetPost.title.rendered}</h1>
      {targetPost.content.rendered && <div className="wp-content" dangerouslySetInnerHTML={{ __html: targetPost.content.rendered }} />}
    </main>
  );
}
