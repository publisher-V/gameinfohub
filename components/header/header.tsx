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
        <ul className="box-border flex flex-wrap items-center justify-start border border-b-2 border-b-[#4a4a4a] border-l-0 border-r-[#4a4a4a] border-t-[#eee] bg-[#c0c0c0] shadow-[inset_2px_1px_0_#eee,inset_-3px_-3px_0_#777] md:h-full">
          {pages.map((page) => {
            let href = page.link;
            try {
              href = new URL(page.link, "http://localhost").pathname;
            } catch (error) {
              console.error("페이지 링크를 가져오지 못했습니다:", error);
              return null;
            }

            return (
              <li
                key={page.id}
                className="box-border flex h-12 w-1/2 items-center justify-center border border-b-0 border-b-[#4a4a4a] border-l-0 border-r-[#4a4a4a] border-t-[#eee] bg-[#c0c0c0] text-center text-[17px] font-bold text-black shadow-[inset_2px_0px_0_#eee,inset_-2px_-3px_0_#777] hover:bg-[#cfcfcf] active:border-b-[#f5f5f5] active:border-l-[#5f5f5f] active:border-r-[#f5f5f5] active:border-t-[#5f5f5f] active:shadow-[inset_1px_1px_0_#8a8a8a] sm:w-1/3 md:h-full md:w-1/6"
              >
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
