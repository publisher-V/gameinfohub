import Link from "next/link";
import { getWordPressFrontendData } from "@/lib/wordpress";

export default async function Header() {
  let pages: any[] = [];

  try {
    const data = await getWordPressFrontendData();
    pages = data?.rest?.pages || [];
  } catch (error) {
    console.error("페이지를 가져오지 못했습니다. :", error);
    return null;
  }

  return (
    <header className="max-w-[1800px] mx-auto w-full h-[100px] flex items-center">
      <nav className="h-full w-full">
        <ul className="flex justify-end items-center gap-x-5 h-full">
          {pages.map((page) => {
            let href = page.link;
            try {
              href = new URL(page.link, "http://localhost").pathname;
            } catch (error) {
              console.error("페이지 링크를 가져오지 못했습니다. :", error);
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
