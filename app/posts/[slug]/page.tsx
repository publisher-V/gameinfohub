import Link from "next/link";
import { notFound } from "next/navigation";
import {
  decodeHtml,
  formatPostDate,
  getPostBySlug,
  stripHtml,
} from "@/lib/wordpress";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = decodeHtml(stripHtml(post.title.rendered));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12 sm:px-10">
      <Link
        href="/"
        className="mb-10 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Back to posts
      </Link>

      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <time className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatPostDate(post.date)}
          </time>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
        </header>

        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </main>
  );
}
