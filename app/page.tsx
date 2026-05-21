import MainPostsWrapper from "@/components/main/main-posts-wrapper";

export default async function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-[1200px]">
        <MainPostsWrapper />
      </main>
    </>
  );
}
