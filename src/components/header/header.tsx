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
    <header className="mx-auto mb-10 flex w-full max-w-[1200px] items-center md:h-[48px] max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <nav className="h-full w-full">
        <ul className="box-border flex flex-wrap items-center justify-start gap-x-8 border-2 md:h-full px-5">
          {pages.map((page) => {
            let href = page.link;
            try {
              href = new URL(page.link, "http://localhost").pathname;
            } catch (error) {
              console.error("페이지 링크를 가져오지 못했습니다:", error);
              return null;
            }

            return (
              <li key={page.id} className="box-border flex h-12 items-center justify-center text-center text-[17px] font-bold text-black md:h-full md:w-auto">
                <Link className="flex h-full w-full items-center justify-center" href={href}>
                  {page.title.rendered}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
