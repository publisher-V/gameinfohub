export type WordPressRendered = {
  rendered: string;
};

export type WordPressPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WordPressRendered;
  excerpt: WordPressRendered;
  content: WordPressRendered;
};

const WORDPRESS_URL =
  process.env.WORDPRESS_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL;

function getWordPressUrl() {
  if (!WORDPRESS_URL) {
    return null;
  }

  return WORDPRESS_URL.replace(/\/$/, "");
}

function buildApiUrl(path: string, params?: Record<string, string | number>) {
  const baseUrl = getWordPressUrl();

  if (!baseUrl) {
    return null;
  }

  const apiUrl = new URL(`/wp-json/wp/v2/${path.replace(/^\//, "")}`, baseUrl);

  for (const [key, value] of Object.entries(params ?? {})) {
    apiUrl.searchParams.set(key, String(value));
  }

  return apiUrl;
}

async function wpFetch<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T | null> {
  const apiUrl = buildApiUrl(path, params);

  if (!apiUrl) {
    return null;
  }

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "gameinfohub-next/1.0 (+https://gameinfohub.com)",
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    const details = responseText.replace(/\s+/g, " ").trim().slice(0, 180);

    throw new Error(
      `WordPress API error: ${response.status} from ${apiUrl.origin}${
        details ? ` - ${details}` : ""
      }`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getLatestPosts(count = 6) {
  return wpFetch<WordPressPost[]>("posts", {
    _fields: "id,date,slug,link,title,excerpt",
    per_page: count,
  });
}

export async function getPostBySlug(slug: string) {
  const posts = await wpFetch<WordPressPost[]>("posts", {
    _fields: "id,date,slug,link,title,content",
    slug,
    per_page: 1,
  });

  return posts?.[0] ?? null;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function decodeHtml(text: string) {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
