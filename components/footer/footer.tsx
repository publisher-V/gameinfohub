export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-12 w-full max-w-[1200px] pb-8 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="box-border flex min-h-14 flex-col items-center justify-between gap-3 border border-b-2 border-b-[#4a4a4a] border-l-[#eee] border-r-[#4a4a4a] border-t-[#eee] bg-[#c0c0c0] px-4 py-3 text-black shadow-[inset_2px_1px_0_#eee,inset_-3px_-3px_0_#777] sm:flex-row">
        <p className="text-center text-sm font-bold sm:text-left">
          Copyright (c) {year} GameInfoHub. All rights reserved.
        </p>
        <a
          href="#topVisual"
          className="box-border flex h-9 min-w-16 items-center justify-center border border-b-[#4a4a4a] border-l-[#eee] border-r-[#4a4a4a] border-t-[#eee] bg-[#c0c0c0] px-4 text-sm font-bold shadow-[inset_2px_1px_0_#f5f5f5,inset_-2px_-2px_0_#777] hover:bg-[#cfcfcf] active:border-b-[#f5f5f5] active:border-l-[#5f5f5f] active:border-r-[#f5f5f5] active:border-t-[#5f5f5f] active:shadow-[inset_1px_1px_0_#8a8a8a]"
        >
          TOP
        </a>
      </div>
    </footer>
  );
}
