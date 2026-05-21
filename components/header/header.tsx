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
    <header className="mx-auto mb-10 flex h-[48px] w-full max-w-[1200px] items-center">
      <nav className="h-full w-full">
        <ul className="box-border flex h-full items-center justify-start border border-b-[#4a4a4a] border-l-0 border-r-[#4a4a4a] border-t-[#dadada] bg-[#c0c0c0] shadow-[inset_1px_1px_0_#eeeeee,inset_-1px_-1px_0_#8a8a8a]">
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
                className="box-border flex h-full min-w-[120px] items-center justify-center border border-t-0 border-b-[#5f5f5f] border-l-0 border-r-[#5f5f5f] bg-[#c0c0c0] text-center text-[17px] font-bold text-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#9a9a9a] hover:bg-[#cfcfcf]"
              >
                <Link className="flex items-center justify-center w-full h-full" href={href}>
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
