export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-12 w-full max-w-[1200px] pb-8 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="retro-frame box-border flex min-h-14 flex-col items-center justify-between gap-3 px-4 py-3 text-[#17120d] sm:flex-row">
        <p className="text-center text-sm sm:text-left">
          Copyright (c) {year} GameInfoHub. All rights reserved.
        </p>
        <a
          href="#topVisual"
          className="retro-button box-border flex h-9 min-w-16 items-center justify-center px-4 text-sm"
        >
          TOP
        </a>
      </div>
    </footer>
  );
}
