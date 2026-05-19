export type WordPressRendered = {
  rendered: string;
};

export type YoastSeo = {
  title?: string;
  metaDesc?: string;
  canonical?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: {
    sourceUrl?: string;
  } | null;
};

export type WordPressSeoJson = Record<string, unknown>;

export type WordPressPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WordPressRendered;
  excerpt: WordPressRendered;
  content: WordPressRendered;
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  yoast_head_json?: WordPressSeoJson | null;
};

export type WordPressPage = {
  id: number;
  slug: string;
  link: string;
  status: string;
  title: WordPressRendered;
  content?: WordPressRendered;
  parent: number;
  menu_order: number;
  yoast_head_json?: WordPressSeoJson | null;
};

export type WordPressMedia = {
  id: number;
  slug: string;
  source_url: string;
  mime_type: string;
  alt_text: string;
  title: WordPressRendered;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<
      string,
      {
        source_url?: string;
        width?: number;
        height?: number;
        mime_type?: string;
      }
    >;
  };
};

export type WordPressTerm = {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
  parent?: number;
};

export type WordPressUser = {
  id: number;
  name: string;
  slug: string;
  link: string;
  description: string;
  avatar_urls: Record<string, string>;
};

export type WordPressComment = {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_url: string;
  date: string;
  content: WordPressRendered;
};

export type WordPressSearchResult = {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
};

export type WordPressNavigation = {
  id: number;
  slug: string;
  status: string;
  type: "wp_navigation";
  link: string;
  title: WordPressRendered;
  content: WordPressRendered;
};

export type GraphQLMenuItem = {
  databaseId: number;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  order: number;
  connectedNode?: {
    node?: {
      databaseId: number;
      title: string;
      slug: string;
      uri: string | null;
    } | null;
  } | null;
};

export type GraphQLMenu = {
  databaseId: number;
  name: string;
  slug: string;
  locations: string[];
  menuItems: {
    nodes: GraphQLMenuItem[];
  };
};

export type GraphQLMediaItem = {
  databaseId: number;
  sourceUrl: string;
  altText: string;
  mimeType: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  } | null;
};

export type GraphQLPost = {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  uri: string;
  excerpt: string;
  content: string;
  categories: {
    nodes: Pick<WordPressTerm, "name" | "slug">[];
  };
  tags: {
    nodes: Pick<WordPressTerm, "name" | "slug">[];
  };
  featuredImage?: {
    node: GraphQLMediaItem;
  } | null;
  seo?: YoastSeo | null;
};

export type GraphQLPage = {
  databaseId: number;
  title: string;
  slug: string;
  uri: string | null;
  content: string | null;
  seo?: Pick<YoastSeo, "title" | "metaDesc" | "canonical"> | null;
};

export type GraphQLUser = {
  databaseId: number;
  name: string;
  slug: string;
  uri: string;
  avatar?: {
    url: string;
  } | null;
};

export type GraphQLComment = {
  databaseId: number;
  date: string;
  content: string;
  author?: {
    node?: {
      name: string;
    } | null;
  } | null;
  commentedOn?: {
    node?: {
      databaseId: number;
      title: string;
      slug: string;
      uri: string;
    } | null;
  } | null;
};

export type WordPressGraphQLData = {
  posts: {
    nodes: GraphQLPost[];
  };
  pages: {
    nodes: GraphQLPage[];
  };
  mediaItems: {
    nodes: GraphQLMediaItem[];
  };
  categories: {
    nodes: Pick<WordPressTerm, "id" | "name" | "slug" | "count">[];
  };
  tags: {
    nodes: Pick<WordPressTerm, "id" | "name" | "slug" | "count">[];
  };
  users: {
    nodes: GraphQLUser[];
  };
  comments: {
    nodes: GraphQLComment[];
  };
  menus: {
    nodes: GraphQLMenu[];
  };
};

export type WordPressFrontendData = {
  rest: {
    posts: WordPressPost[];
    pages: WordPressPage[];
    media: WordPressMedia[];
    categories: WordPressTerm[];
    tags: WordPressTerm[];
    users: WordPressUser[];
    comments: WordPressComment[];
    search: WordPressSearchResult[];
    navigation: WordPressNavigation[];
  };
  graphql: WordPressGraphQLData | null;
};

type FetchParams = Record<string, string | number | boolean>;

type GraphQLResponse<T> = {
  data?: T;
  errors?: {
    message: string;
  }[];
};

const WORDPRESS_URL =
  process.env.WORDPRESS_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL;

function getWordPressUrl() {
  if (!WORDPRESS_URL) {
    return null;
  }

  return WORDPRESS_URL.replace(/\/$/, "");
}

function buildApiUrl(path: string, params?: FetchParams) {
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

function buildGraphQLUrl() {
  const baseUrl = getWordPressUrl();

  if (!baseUrl) {
    return null;
  }

  return new URL("/graphql", baseUrl);
}

async function wpFetch<T>(
  path: string,
  params?: FetchParams,
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

async function wpGraphQLFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  const apiUrl = buildGraphQLUrl();

  if (!apiUrl) {
    return null;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "gameinfohub-next/1.0 (+https://gameinfohub.com)",
    },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    const details = responseText.replace(/\s+/g, " ").trim().slice(0, 180);

    throw new Error(
      `WordPress GraphQL error: ${response.status} from ${apiUrl.origin}${
        details ? ` - ${details}` : ""
      }`,
    );
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(
      `WordPress GraphQL error: ${payload.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
  }

  return payload.data ?? null;
}

export async function getLatestPosts(count = 6) {
  return wpFetch<WordPressPost[]>("posts", {
    _fields: "id,date,slug,link,title,excerpt,yoast_head_json",
    per_page: count,
  });
}

export async function getPostBySlug(slug: string) {
  const posts = await wpFetch<WordPressPost[]>("posts", {
    _fields:
      "id,date,slug,link,title,excerpt,content,categories,tags,featured_media,yoast_head_json",
    slug,
    per_page: 1,
  });

  return posts?.[0] ?? null;
}

export async function getPages(count = 100) {
  return wpFetch<WordPressPage[]>("pages", {
    _fields:
      "id,slug,link,status,title,content,parent,menu_order,yoast_head_json",
    orderby: "menu_order",
    order: "asc",
    per_page: count,
  });
}

export async function getMediaItems(count = 100) {
  return wpFetch<WordPressMedia[]>("media", {
    _fields:
      "id,slug,source_url,mime_type,alt_text,title,media_details",
    per_page: count,
  });
}

export async function getCategories(count = 100) {
  return wpFetch<WordPressTerm[]>("categories", {
    _fields: "id,name,slug,count,description,parent",
    hide_empty: false,
    per_page: count,
  });
}

export async function getTags(count = 100) {
  return wpFetch<WordPressTerm[]>("tags", {
    _fields: "id,name,slug,count,description",
    hide_empty: false,
    per_page: count,
  });
}

export async function getUsers(count = 100) {
  return wpFetch<WordPressUser[]>("users", {
    _fields: "id,name,slug,link,description,avatar_urls",
    per_page: count,
  });
}

export async function getComments(count = 100) {
  return wpFetch<WordPressComment[]>("comments", {
    _fields:
      "id,post,parent,author_name,author_url,date,content",
    per_page: count,
  });
}

export async function getSearchResults(search = "", count = 100) {
  return wpFetch<WordPressSearchResult[]>("search", {
    search,
    per_page: count,
  });
}

export async function getNavigation(count = 100) {
  return wpFetch<WordPressNavigation[]>("navigation", {
    per_page: count,
  });
}

export async function getGraphQLFrontendData() {
  const query = `
    query FrontendData {
      posts(first: 100) {
        nodes {
          databaseId
          title
          slug
          date
          uri
          excerpt
          content
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              databaseId
              sourceUrl
              altText
              mimeType
              mediaDetails {
                width
                height
              }
            }
          }
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
          }
        }
      }
      pages(first: 100) {
        nodes {
          databaseId
          title
          slug
          uri
          content
          seo {
            title
            metaDesc
            canonical
          }
        }
      }
      mediaItems(first: 100) {
        nodes {
          databaseId
          sourceUrl
          altText
          mimeType
          mediaDetails {
            width
            height
          }
        }
      }
      categories(first: 100) {
        nodes {
          id: databaseId
          name
          slug
          count
        }
      }
      tags(first: 100) {
        nodes {
          id: databaseId
          name
          slug
          count
        }
      }
      users(first: 100) {
        nodes {
          databaseId
          name
          slug
          uri
          avatar {
            url
          }
        }
      }
      comments(first: 100) {
        nodes {
          databaseId
          date
          content
          author {
            node {
              name
            }
          }
          commentedOn {
            node {
              ... on Post {
                databaseId
                title
                slug
                uri
              }
              ... on Page {
                databaseId
                title
                slug
                uri
              }
            }
          }
        }
      }
      menus {
        nodes {
          databaseId
          name
          slug
          locations
          menuItems {
            nodes {
              databaseId
              label
              url
              path
              parentId
              order
              connectedNode {
                node {
                  ... on Post {
                    databaseId
                    title
                    slug
                    uri
                  }
                  ... on Page {
                    databaseId
                    title
                    slug
                    uri
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return wpGraphQLFetch<WordPressGraphQLData>(query);
}

export async function getWordPressFrontendData(): Promise<WordPressFrontendData> {
  const [
    posts,
    pages,
    media,
    categories,
    tags,
    users,
    comments,
    search,
    navigation,
    graphql,
  ] = await Promise.all([
    wpFetch<WordPressPost[]>("posts", {
      _fields:
        "id,date,slug,link,title,excerpt,content,categories,tags,featured_media,yoast_head_json",
      per_page: 100,
    }),
    getPages(),
    getMediaItems(),
    getCategories(),
    getTags(),
    getUsers(),
    getComments(),
    getSearchResults(),
    getNavigation(),
    getGraphQLFrontendData().catch(() => null),
  ]);

  return {
    rest: {
      posts: posts ?? [],
      pages: pages ?? [],
      media: media ?? [],
      categories: categories ?? [],
      tags: tags ?? [],
      users: users ?? [],
      comments: comments ?? [],
      search: search ?? [],
      navigation: navigation ?? [],
    },
    graphql,
  };
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
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, "&");
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
