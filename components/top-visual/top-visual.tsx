import Link from "next/link";

export default function TopVisual() {
  return (
    <section id="topVisual" className="mx-auto flex h-[120px] w-full max-w-[1200px] items-center justify-center px-4 md:h-[150px]">
      <Link href="/" className="text-4xl leading-none sm:text-5xl lg:text-7xl">
        Game Info Hub
      </Link>
    </section>
  );
}
