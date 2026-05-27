import MainPostsWrapper from "./main-posts-wrapper";

export default function Main() {
  return (
    <main className="flex-1 mx-auto w-full max-w-[1200px] max-[1260px]:max-w-none max-[1260px]:px-[30px]">
      <MainPostsWrapper />
    </main>
  );
}
