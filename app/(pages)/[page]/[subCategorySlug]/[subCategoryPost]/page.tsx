import { getWordPressFrontendData, WordPressPost } from "@/lib/wordpress";

export default async function SubCategoryPostPage({ params }: { params: Promise<{ subCategoryPost: string }> }) {
  const subCategoryParams = await params;
  const subCategoryPost = subCategoryParams.subCategoryPost;

  let targetPost: WordPressPost | undefined;

  try {
    const data = await getWordPressFrontendData();
    targetPost = data?.rest?.posts?.find((post) => post.slug === subCategoryPost);
  } catch (error) {
    console.error("포스트를 가져오지 못했습니다. :", error);
    return null;
  }

  if (!targetPost) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">포스트를 찾을 수 없습니다.</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{targetPost.title.rendered}</h1>
      {targetPost.content.rendered && <div className="text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: targetPost.content.rendered }} />}
    </main>
  );
}
