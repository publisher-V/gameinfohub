import MainPostsWrapper from "@/components/main/main-posts-wrapper";

export default async function Home() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
        <MainPostsWrapper />
      </main>
    </>
  );
}
