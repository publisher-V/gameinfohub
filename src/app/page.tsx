import PostListSection from "@/components/post-list-section/post-list-section";
import RankListSection from "@/components/rank-list-section/rank-list-section";

export default async function Home() {
  return (
    <>
      <main className="flex flex-1 gap-20 mx-auto w-full max-w-[1200px] max-[1260px]:max-w-none max-[1260px]:px-[30px]">
        <PostListSection />
        <RankListSection />
      </main>
    </>
  );
}
