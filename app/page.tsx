import MainPostsWrapper from "@/components/main/main-posts-wrapper";

export default async function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-[1200px] max-[1260px]:max-w-none max-[1260px]:px-[30px]">
        <MainPostsWrapper />
      </main>
    </>
  );
}
