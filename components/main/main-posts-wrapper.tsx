import { getWordPressFrontendData } from "@/lib/wordpress";
import type { WordPressPost } from "@/lib/wordpress";

function DataSection({
  id,
  title,
  children,
}: Readonly<{
  id?: string;
  title?: string;
  children: React.ReactNode;
}>) {
  return (
    <section id={id} className="flex flex-col gap-4">
      {title && <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>}

      {children}
    </section>
  );
}

export default async function MainPostsWrapper() {
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

  return (
    <DataSection id="mainPostsWrapper" title="Latest Posts">
      <ul className="main-post-list">
        {rest.posts.map((post: WordPressPost) => (
          <li key={post.id}>
            <a href={post.link}>{post.title.rendered}</a>
          </li>
        ))}
      </ul>
    </DataSection>
  );
}
