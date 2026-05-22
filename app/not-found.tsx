import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">페이지를 찾을 수 없습니다</h1>
      <p className="text-zinc-600 dark:text-zinc-400">페이지가 이동되었거나 더 이상 존재하지 않습니다.</p>
      <Link
        href="/"
        className="box-border inline-flex h-9 w-fit min-w-[96px] items-center justify-center border border-b-[#5f5f5f] border-l-[#f5f5f5] border-r-[#5f5f5f] border-t-[#f5f5f5] bg-[#c0c0c0] px-4 text-[14px] font-bold text-black shadow-[inset_1px_1px_0_#eee,inset_-1px_-1px_0_#9a9a9a] hover:bg-[#cfcfcf] active:border-b-[#f5f5f5] active:border-l-[#5f5f5f] active:border-r-[#f5f5f5] active:border-t-[#5f5f5f] active:shadow-[inset_1px_1px_0_#8a8a8a]"
      >
        홈
      </Link>
    </main>
  );
}
