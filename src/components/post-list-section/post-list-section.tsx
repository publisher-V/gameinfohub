import MainPostsWrapper from "../main-posts-wrapper/main-posts-wrapper";

export default function PostListSection() {
  // const platFormArray = ["pc", "ps5", "xbox", "nintendo switch", "nintendo switch2"];

  return (
    <section className="w-[60%]">
      <article></article>
      <article>
        <MainPostsWrapper title="최신 게시글" categorySlug="guide" />
        <MainPostsWrapper title="최신 뉴스" categorySlug="news" />
      </article>
    </section>
  );
}
