import Link from "next/link";
import Image from "next/image";
import {
  decodeHtml,
  formatPostDate,
  getWordPressFrontendData,
  stripHtml,
  type GraphQLMenu,
  type WordPressMedia,
  type WordPressPage,
  type WordPressPost,
  type WordPressTerm,
} from "@/lib/wordpress";

export default async function Home() {
  let data: Awaited<ReturnType<typeof getWordPressFrontendData>> | null = null;
  let error: string | null = null;

  try {
    data = await getWordPressFrontendData();
  } catch (caughtError) {
    error =
      caughtError instanceof Error
        ? caughtError.message
        : "WordPress API connection failed.";
  }

  if (error) {
    return <ConnectionError message={error} />;
  }

  if (!data) {
    return <SetupNotice />;
    
  }

  const { rest, graphql } = data;
  const menus = graphql?.menus.nodes ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <header className="flex flex-col gap-3 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          WordPress data hub
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
          Frontend-ready WordPress data
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          This page is now powered by the same data helper you can import from{" "}
          <code>@/lib/wordpress</code>. Client components can also fetch the
          combined payload from <code>/api/wordpress-data</code>.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Posts" value={rest.posts.length} />
        <Stat label="Pages" value={rest.pages.length} />
        <Stat label="Media" value={rest.media.length} />
        <Stat label="Menus" value={menus.length} />
      </section>

      <DataSection title="Posts">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </DataSection>

      <DataSection title="Pages">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.pages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </DataSection>

      <DataSection title="Media">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.media.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </DataSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <DataSection title="Taxonomies">
          <TermList title="Categories" terms={rest.categories} />
          <TermList title="Tags" terms={rest.tags} />
        </DataSection>

        <DataSection title="Menus">
          <div className="flex flex-col gap-4">
            {menus.length > 0 ? (
              menus.map((menu) => <MenuCard key={menu.databaseId} menu={menu} />)
            ) : (
              <EmptyState label="No GraphQL menus returned." />
            )}
          </div>
        </DataSection>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <DataSection title="Users and comments">
          <div className="flex flex-col gap-4">
            <CountLine label="Users" value={rest.users.length} />
            <CountLine label="Comments" value={rest.comments.length} />
            {rest.comments.slice(0, 3).map((comment) => (
              <p
                key={comment.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
              >
                <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {comment.author_name}
                </span>
                : {decodeHtml(stripHtml(comment.content.rendered))}
              </p>
            ))}
          </div>
        </DataSection>

        <DataSection title="Plugin data">
          <div className="flex flex-col gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <CountLine
              label="Yoast SEO via REST"
              value={rest.posts.filter((post) => post.yoast_head_json).length}
            />
            <CountLine
              label="Yoast SEO via GraphQL"
              value={
                graphql?.posts.nodes.filter((post) => post.seo?.title).length ??
                0
              }
            />
            <CountLine
              label="GraphQL posts"
              value={graphql?.posts.nodes.length ?? 0}
            />
            <CountLine
              label="REST search results"
              value={rest.search.length}
            />
          </div>
        </DataSection>
      </div>
    </main>
  );
}

function DataSection({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

function PostCard({ post }: { post: WordPressPost }) {
  const title = decodeHtml(stripHtml(post.title.rendered));
  const excerpt = decodeHtml(stripHtml(post.excerpt.rendered));
  const seoTitle =
    typeof post.yoast_head_json?.title === "string"
      ? post.yoast_head_json.title
      : null;

  return (
    <article className="flex min-h-64 flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-3">
        <time className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatPostDate(post.date)}
        </time>
        <h3 className="text-xl font-semibold leading-snug text-zinc-950 dark:text-zinc-50">
          {title}
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {excerpt}
        </p>
        {seoTitle ? (
          <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500">
            SEO: {seoTitle}
          </p>
        ) : null}
      </div>

      <Link
        href={`/posts/${post.slug}`}
        className="mt-6 text-sm font-semibold text-zinc-950 underline underline-offset-4 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
      >
        Open post
      </Link>
    </article>
  );
}

function PageCard({ page }: { page: WordPressPage }) {
  const title = decodeHtml(stripHtml(page.title.rendered));
  const description = page.content?.rendered
    ? decodeHtml(stripHtml(page.content.rendered))
    : "No public page content returned.";

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <p className="mt-4 break-all text-xs text-zinc-500 dark:text-zinc-500">
        {page.link}
      </p>
    </article>
  );
}

function MediaCard({ item }: { item: WordPressMedia }) {
  const title = decodeHtml(stripHtml(item.title.rendered));

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {item.mime_type.startsWith("image/") ? (
        <Image
          src={item.source_url}
          alt={item.alt_text || title}
          width={item.media_details?.width ?? 1200}
          height={item.media_details?.height ?? 675}
          className="aspect-video w-full bg-zinc-100 object-cover dark:bg-zinc-900"
        />
      ) : null}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {item.mime_type}
          {item.media_details?.width && item.media_details.height
            ? ` - ${item.media_details.width}x${item.media_details.height}`
            : ""}
        </p>
      </div>
    </article>
  );
}

function TermList({ title, terms }: { title: string; terms: WordPressTerm[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      {terms.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {terms.map((term) => (
            <li
              key={term.id}
              className="flex items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400"
            >
              <span>{term.name}</span>
              <span>{term.count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState label={`No ${title.toLowerCase()} returned.`} />
      )}
    </div>
  );
}

function MenuCard({ menu }: { menu: GraphQLMenu }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {decodeHtml(menu.name)}
        </h3>
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
          {menu.locations.join(", ") || "No location"}
        </p>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {menu.menuItems.nodes.map((item) => (
          <li
            key={item.databaseId}
            className="flex items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400"
          >
            <span>{decodeHtml(item.label)}</span>
            <span className="break-all text-xs text-zinc-500">
              {decodeHtml(item.path)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CountLine({ label, value }: { label: string; value: number }) {
  return (
    <p className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <span>{label}</span>
      <span className="font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </span>
    </p>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="mt-3 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
      {label}
    </p>
  );
}

function SetupNotice() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12 sm:px-10">
      <section className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          Waiting for WordPress
        </h1>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          Add <code>WORDPRESS_URL=https://your-wordpress-domain.com</code> to{" "}
          <code>.env.local</code>.
        </p>
      </section>
    </main>
  );
}

function ConnectionError({ message }: { message: string }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12 sm:px-10">
      <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
        <h1 className="text-xl font-semibold">WordPress connection failed</h1>
        <p className="mt-3 leading-7">{message}</p>
      </section>
    </main>
  );
}
