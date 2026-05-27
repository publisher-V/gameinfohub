export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-12 w-full max-w-[1200px] pb-5 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="box-border flex min-h-20 flex-col items-center justify-between gap-3 border-t-2 text-black sm:flex-row max-[40rem]:pt-4">
        <p className="text-center text-sm font-bold sm:text-left">Copyright (c) {year} GameInfoHub. All rights reserved.</p>
        <a href="#topVisual" className="box-border flex h-9 min-w-16 items-center justify-center border-2 px-4 text-sm font-bold">
          TOP
        </a>
      </div>
    </footer>
  );
}
