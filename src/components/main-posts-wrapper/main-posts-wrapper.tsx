import Link from "next/link";
import { formatPostDate, getWordPressFrontendData } from "@/lib/wordpress";
import type { WordPressPost, WordPressTerm } from "@/lib/wordpress";

function getPostHref(post: WordPressPost, categories: WordPressTerm[]) {
  const postCategories = categories.filter((category) => post.categories?.includes(category.id));
  const childCategory = postCategories.find((category) => category.parent);
  const parentCategory = childCategory ? categories.find((category) => category.id === childCategory.parent) : undefined;

  if (parentCategory && childCategory) {
    return `/${parentCategory.slug}/${childCategory.slug}/${post.slug}`;
  }

  if (postCategories.length > 0) {
    return `/${postCategories[0].slug}/${post.slug}`;
  }

  return `/${post.slug}`;
}

type MainPostsWrapperProps = {
  title: string;
  categorySlug: string;
};

export default async function MainPostsWrapper({ title, categorySlug }: MainPostsWrapperProps) {
  let data: Awaited<ReturnType<typeof getWordPressFrontendData>> | null = null;
  let error: string | null = null;

  try {
    data = await getWordPressFrontendData();
  } catch (caughtError) {
    error = caughtError instanceof Error ? caughtError.message : "워드프레스 API를 연결할 수 없습니다.";
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  const { rest } = data;
  const targetCategory = rest.categories.find((category) => category.slug === categorySlug);
  const targetCategoryIds = targetCategory ? [targetCategory.id, ...rest.categories.filter((category) => category.parent === targetCategory.id).map((category) => category.id)] : [];
  const filteredPosts = rest.posts.filter((post) => post.categories?.some((categoryId) => targetCategoryIds.includes(categoryId)));

  return (
    <section id="mainPostsWrapper" className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <ul className="main-post-list">
        {filteredPosts.map((post: WordPressPost) => (
          <li key={post.id} className="border-t-1 h-32">
            <Link className="flex flex-col w-full h-full py-4 hover:text-[#702a1a]" href={getPostHref(post, rest.categories)}>
              <p className="mb-2">{post.title.rendered}</p>
              <p className="text-sm text-zinc-500">{formatPostDate(post.date)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
