import Link from "next/link";

export default function TopVisual() {
  return (
    <section id="topVisual" className="mx-auto flex h-[120px] w-full max-w-[1200px] items-center justify-center px-4 md:h-[150px]">
      <Link
        href="/"
        className="relative z-0 inline-block text-center text-4xl font-bold leading-none text-[#141414] [text-shadow:1px_1px_0_#f1f1f1,2px_2px_0_#d3d3d3,3px_3px_0_#a8a8a8,4px_4px_0_#6f6f6f,6px_7px_0_#333333,8px_10px_12px_#00000061] sm:text-5xl lg:text-7xl"
      >
        GAME INFO HUB
      </Link>
    </section>
  );
}
