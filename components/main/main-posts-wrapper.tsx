import Image from "next/image";
import Link from "next/link";
import {
  decodeHtml,
  formatPostDate,
  getWordPressFrontendData,
  stripHtml,
  type WordPressMedia,
  type WordPressPost,
  type WordPressTerm,
} from "@/lib/wordpress";

const NEWS_MATCHER = /(news|review|update|article|announcement|release)/i;
const GUIDE_MATCHER = /(guide|tips?|tutorial|howto|walkthrough)/i;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getPostHref(post: WordPressPost, categories: WordPressTerm[]) {
  const postCategories = categories.filter((category) => post.categories?.includes(category.id));
  const childCategory = postCategories.find((category) => category.parent);
  const parentCategory = childCategory ? categories.find((category) => category.id === childCategory.parent) : undefined;

  if (parentCategory && childCategory) {
    return `/${parentCategory.slug}/${childCategory.slug}/${post.slug}`;
  }

  return `/posts/${post.slug}`;
}

function getFeaturedImage(post: WordPressPost, mediaById: Map<number, WordPressMedia>) {
  if (!post.featured_media) {
    return null;
  }

  return mediaById.get(post.featured_media) ?? null;
}

function getPostCategoryLabel(post: WordPressPost, categories: WordPressTerm[]) {
  const postCategories = categories.filter((category) => post.categories?.includes(category.id));
  const childCategory = postCategories.find((category) => category.parent);
  const parentCategory = childCategory ? categories.find((category) => category.id === childCategory.parent) : undefined;

  return childCategory?.name ?? parentCategory?.name ?? postCategories[0]?.name ?? "POST";
}

function getPostTitle(post: WordPressPost) {
  return decodeHtml(stripHtml(post.title.rendered));
}

function getSectionPosts(
  posts: WordPressPost[],
  categories: WordPressTerm[],
  matcher: RegExp,
  limit: number,
  excludeIds: number[] = [],
) {
  const matchedCategoryIds = categories
    .filter((category) => matcher.test(normalize(category.slug)) || matcher.test(normalize(category.name)))
    .map((category) => category.id);

  const matchedPosts = posts
    .filter((post) => post.categories?.some((categoryId) => matchedCategoryIds.includes(categoryId)))
    .filter((post) => !excludeIds.includes(post.id));

  const fallbackPosts = posts.filter((post) => !excludeIds.includes(post.id));
  const combined = [...matchedPosts, ...fallbackPosts].filter(
    (post, index, array) => array.findIndex((item) => item.id === post.id) === index,
  );

  return combined.sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, limit);
}

function getLatestPosts(posts: WordPressPost[], limit: number) {
  return [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, limit);
}

function RetroCard({
  post,
  categories,
  mediaById,
}: Readonly<{
  post: WordPressPost;
  categories: WordPressTerm[];
  mediaById: Map<number, WordPressMedia>;
}>) {
  const href = getPostHref(post, categories);
  const title = getPostTitle(post);
  const label = getPostCategoryLabel(post, categories);
  const image = getFeaturedImage(post, mediaById);
  const alt = image?.alt_text?.trim() || title;

  return (
    <Link href={href} className="retro-card group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[rgba(47,31,20,0.82)] bg-[#1c1611]">
        {image ? (
          <Image
            src={image.source_url}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#3c2b1d_0%,#1f1711_52%,#493323_100%)]">
            <span className="text-[15px] uppercase tracking-[0.28em] text-[#f4e0b8]">{label}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 py-3 text-[#17120d]">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#6f5338]">
          {label} | {formatPostDate(post.date)}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[17px] leading-[1.06] text-[#15110d]">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function SideCard({
  post,
  categories,
  mediaById,
  title,
}: Readonly<{
  post: WordPressPost;
  categories: WordPressTerm[];
  mediaById: Map<number, WordPressMedia>;
  title: string;
}>) {
  const href = getPostHref(post, categories);
  const postTitle = getPostTitle(post);
  const image = getFeaturedImage(post, mediaById);

  return (
    <Link href={href} className="retro-card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div className="border-b border-[rgba(47,31,20,0.82)] px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6f5338]">{title}</p>
      </div>
      <div className="px-4 py-4">
        <h3 className="line-clamp-3 text-[20px] leading-[1.1] text-[#15110d]">
          {postTitle}
        </h3>
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#6f5338]">
          {formatPostDate(post.date)}
        </p>
      </div>
      <div className="px-4 pb-4">
        <div className="relative aspect-[16/10] overflow-hidden border border-[rgba(47,31,20,0.85)] bg-[#1c1611]">
          {image ? (
            <Image
              src={image.source_url}
              alt={image.alt_text?.trim() || postTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 28vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#3c2b1d_0%,#1f1711_52%,#493323_100%)]">
              <span className="text-[14px] uppercase tracking-[0.24em] text-[#f4e0b8]">Game Info Hub</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({
  title,
  subtitle,
}: Readonly<{
  title: string;
  subtitle?: string;
}>) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[rgba(47,31,20,0.42)] pb-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#7b5b3d]">Section</p>
        <h2 className="mt-1 text-[22px] leading-none text-[#16110d]">{title}</h2>
      </div>
      {subtitle ? <p className="text-[11px] uppercase tracking-[0.24em] text-[#7b5b3d]">{subtitle}</p> : null}
    </div>
  );
}

export default async function MainPostsWrapper() {
  let data: Awaited<ReturnType<typeof getWordPressFrontendData>> | null = null;
  let error: string | null = null;

  try {
    data = await getWordPressFrontendData();
  } catch (caughtError) {
    error = caughtError instanceof Error ? caughtError.message : "WordPress API 연결에 실패했습니다.";
  }

  if (error) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 px-4 pb-10 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
        <div className="retro-frame w-full px-5 py-6 text-[#15110d]">
          <h1 className="text-[22px]">WordPress connection failed</h1>
          <p className="mt-3 text-[14px] leading-7">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 px-4 pb-10 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
        <div className="retro-frame w-full px-5 py-6 text-[#15110d]">
          <h1 className="text-[22px]">Waiting for WordPress</h1>
          <p className="mt-3 text-[14px] leading-7">Add <code>WORDPRESS_URL</code> to <code>.env.local</code>.</p>
        </div>
      </main>
    );
  }

  const { rest } = data;
  const mediaById = new Map(rest.media.map((item) => [item.id, item]));
  const latestPosts = getLatestPosts(rest.posts, 8);
  const heroPost = latestPosts[0];
  const newsPosts = getSectionPosts(latestPosts, rest.categories, NEWS_MATCHER, 5);
  const guidePosts = getSectionPosts(latestPosts, rest.categories, GUIDE_MATCHER, 5, newsPosts.map((post) => post.id));
  const heroImage = heroPost ? getFeaturedImage(heroPost, mediaById) : null;
  const heroHref = heroPost ? getPostHref(heroPost, rest.categories) : "/";
  const sidePosts = latestPosts.slice(1, 3);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-7 px-4 pb-10 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_1.35fr_0.9fr]">
        <div className="retro-frame flex flex-col justify-between gap-5 px-5 py-5">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#7b5b3d]">Featured story</p>
            <h1 className="max-w-[12ch] text-[34px] leading-[0.92] text-[#15110d] sm:text-[44px]">
              GAMES NEVER FADE.
            </h1>
            <p className="max-w-[24ch] text-[18px] leading-8 text-[#2a2118]">
              레트로 게임의 모든 정보, 한 곳에서.
            </p>
          </div>

          {heroPost ? (
            <Link
              href={heroHref}
              className="retro-button inline-flex w-fit items-center justify-center px-5 py-3 text-[13px] uppercase tracking-[0.2em]"
            >
              Explore games
            </Link>
          ) : null}
        </div>

        <Link href={heroHref} className="retro-frame group relative overflow-hidden">
          <div className="relative aspect-[16/10] min-h-[420px] bg-[#1c1611]">
            {heroImage ? (
              <Image
                src={heroImage.source_url}
                alt={heroImage.alt_text?.trim() || getPostTitle(heroPost!)}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#3c2b1d_0%,#1f1711_52%,#493323_100%)]">
                <div className="text-center text-[#f4e0b8]">
                  <p className="text-[12px] uppercase tracking-[0.3em]">No featured image</p>
                  <p className="mt-2 text-[28px] leading-[1.05]">Game Info Hub</p>
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(18,12,8,0.12)_100%)]" />
          </div>
          {heroPost ? (
            <div className="absolute bottom-4 left-4 right-4 border border-[rgba(47,31,20,0.8)] bg-[rgba(241,224,188,0.9)] px-4 py-3 text-[#16110d] shadow-[1px_1px_0_rgba(47,31,20,0.22)]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#7b5b3d]">
                {getPostCategoryLabel(heroPost, rest.categories)} | {formatPostDate(heroPost.date)}
              </p>
              <h2 className="mt-2 line-clamp-2 text-[24px] leading-[1.04]">
                {getPostTitle(heroPost)}
              </h2>
            </div>
          ) : null}
        </Link>

        <div className="flex flex-col gap-4">
          {sidePosts.map((post, index) => (
            <SideCard
              key={post.id}
              post={post}
              categories={rest.categories}
              mediaById={mediaById}
              title={index === 0 ? "Latest update" : "Random pick"}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Latest News" subtitle="Featured games style cards" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {newsPosts.map((post) => (
            <RetroCard key={post.id} post={post} categories={rest.categories} mediaById={mediaById} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Guides" subtitle="Tap a card to open it" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {guidePosts.map((post) => (
            <RetroCard key={post.id} post={post} categories={rest.categories} mediaById={mediaById} />
          ))}
        </div>
      </section>
    </main>
  );
}
