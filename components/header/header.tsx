import Link from "next/link";
import { getWordPressFrontendData, type WordPressPage } from "@/lib/wordpress";

type NavItem = {
  label: string;
  candidates: string[];
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "HOME", candidates: ["/"], active: true },
  { label: "GAMES", candidates: ["games", "game"] },
  { label: "PLATFORMS", candidates: ["platforms", "platform"] },
  { label: "COLLECTIONS", candidates: ["collections", "collection"] },
  { label: "ARTICLES", candidates: ["articles", "news", "guide"] },
  { label: "COMMUNITY", candidates: ["community", "forum"] },
  { label: "ABOUT", candidates: ["about", "about-us"] },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function toPath(link: string) {
  try {
    return new URL(link, "http://localhost").pathname;
  } catch {
    return "/";
  }
}

function resolveNavHref(pages: WordPressPage[], candidates: string[], fallback = "/") {
  const matchedPage = pages.find((page) => {
    const slug = normalizeText(page.slug);
    const title = normalizeText(page.title.rendered);
    return candidates.some((candidate) => slug === normalizeText(candidate) || title.includes(normalizeText(candidate)));
  });

  return matchedPage ? toPath(matchedPage.link) : fallback;
}

export default async function Header() {
  let pages: WordPressPage[] = [];

  try {
    const data = await getWordPressFrontendData();
    pages = data?.rest?.pages || [];
  } catch (error) {
    console.error("Failed to load page navigation.", error);
    return null;
  }

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    href: item.candidates[0] === "/" ? "/" : resolveNavHref(pages, item.candidates),
  }));

  return (
    <header className="mx-auto w-full max-w-[1200px] px-4 pb-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="retro-frame px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col">
            <Link href="/" className="inline-flex flex-col text-[#15110d]">
              <span className="text-[38px] leading-[0.86] sm:text-[46px] md:text-[56px]">GAME</span>
              <span className="text-[38px] leading-[0.86] sm:text-[46px] md:text-[56px]">INFO HUB</span>
            </Link>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[#5f4b35]">
              Retro games database & archive
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:items-end">
            <nav aria-label="Primary" className="w-full overflow-x-auto">
              <ul className="flex min-w-max items-center gap-6 border-b border-[#6f5338] pb-2 text-[13px] uppercase tracking-[0.22em] text-[#1b1510]">
                {navItems.map((item) => (
                  <li key={item.label} className="shrink-0">
                    <Link
                      href={item.href}
                      data-active={item.active ? "true" : "false"}
                      className="retro-nav-link"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="retro-search flex w-full max-w-[320px] items-stretch overflow-hidden" role="search" aria-label="Search games">
              <input
                type="search"
                aria-label="Search games"
                placeholder="Search games..."
                className="min-w-0 flex-1 px-4 py-3 text-[13px] uppercase tracking-[0.18em]"
              />
              <button
                type="button"
                className="retro-button flex w-12 items-center justify-center text-[16px]"
                aria-label="Search"
              >
                ⌕
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
