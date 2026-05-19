import Link from "next/link";
import { getWordPressFrontendData, WordPressPage } from "@/lib/wordpress";

export default async function Header() {
  let pages: WordPressPage[] = [];

  try {
    const data = await getWordPressFrontendData();
    pages = data?.rest?.pages || [];
  } catch (error) {
    console.error("페이지 데이터를 가져오지 못했습니다:", error);
    return null;
  }

  return (
    <header className="mx-auto flex h-[100px] w-full max-w-[1800px] items-center">
      <nav className="h-full w-full">
        <ul className="flex h-full items-center justify-end gap-x-5">
          {pages.map((page) => {
            let href = page.link;
            try {
              href = new URL(page.link, "http://localhost").pathname;
            } catch (error) {
              console.error("페이지 링크를 가져오지 못했습니다:", error);
              return null;
            }

            return (
              <li key={page.id}>
                <Link href={href}>{page.title.rendered}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
