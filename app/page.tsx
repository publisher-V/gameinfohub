import Link from "next/link";
import {
  decodeHtml,
  formatPostDate,
  getLatestPosts,
  stripHtml,
  type WordPressPost,
} from "@/lib/wordpress";

export default async function Home() {
  let posts: WordPressPost[] | null = null;
  let error: string | null = null;

  try {
    posts = await getLatestPosts();
  } catch (caughtError) {
    error =
      caughtError instanceof Error
        ? caughtError.message
        : "WordPress API connection failed.";
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Headless WordPress
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
          WordPress REST API에서 가져온 최신 글
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          워드프레스 도메인을 환경변수로 연결하면 이 화면이 JSON 데이터를
          서버에서 읽어 렌더링합니다.
        </p>
      </header>

      {!posts && !error ? <SetupNotice /> : null}
      {error ? <ConnectionError message={error} /> : null}
      {posts?.length === 0 ? <EmptyPosts /> : null}

      {posts && posts.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => {
            const title = decodeHtml(stripHtml(post.title.rendered));
            const excerpt = decodeHtml(stripHtml(post.excerpt.rendered));

            return (
              <article
                key={post.id}
                className="flex min-h-60 flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex flex-col gap-4">
                  <time className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatPostDate(post.date)}
                  </time>
                  <h2 className="text-2xl font-semibold leading-snug text-zinc-950 dark:text-zinc-50">
                    {title}
                  </h2>
                  <p className="line-clamp-3 leading-7 text-zinc-600 dark:text-zinc-400">
                    {excerpt}
                  </p>
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="mt-8 text-sm font-semibold text-zinc-950 underline underline-offset-4 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
                >
                  자세히 보기
                </Link>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}

function SetupNotice() {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        워드프레스 도메인 연결 대기 중
      </h2>
      <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
        프로젝트 루트에 <code>.env.local</code>을 만들고{" "}
        <code>WORDPRESS_URL=https://your-wordpress-domain.com</code> 형식으로
        입력하면 됩니다.
      </p>
    </section>
  );
}

function ConnectionError({ message }: { message: string }) {
  return (
    <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
      <h2 className="text-xl font-semibold">워드프레스 연결 실패</h2>
      <p className="mt-3 leading-7">{message}</p>
    </section>
  );
}

function EmptyPosts() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        아직 공개된 글이 없습니다
      </h2>
      <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
        워드프레스 관리자에서 공개 상태의 글을 추가하면 여기에 표시됩니다.
      </p>
    </section>
  );
}
