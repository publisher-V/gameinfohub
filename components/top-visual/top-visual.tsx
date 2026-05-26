import Link from "next/link";

export default function TopVisual() {
  return (
    <section id="topVisual" className="mx-auto w-full max-w-[1200px] px-4 pt-3 max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <div className="retro-frame flex items-center justify-between gap-4 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#18120d]">
        <p className="truncate">Welcome to the world of retro games</p>
        <Link href="/" className="inline-flex items-center gap-3 whitespace-nowrap">
          <span>Press Start</span>
          <span aria-hidden className="inline-block h-3.5 w-3.5 border border-current" />
        </Link>
      </div>
    </section>
  );
}
