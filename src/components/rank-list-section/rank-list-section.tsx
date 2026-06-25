import MainRankWrapper from "../main-rank-wrapper/main-rank-wrapper";

export default function RankListSection() {
  // const platFormArray = ["pc", "ps5", "xbox", "nintendo switch", "nintendo switch2"];

  return (
    <section className="flex flex-col gap-6 w-[40%]">
      <MainRankWrapper title="역대 게임 판매량 TOP3" type="game" />
      <MainRankWrapper title="역대 콘솔 판매량 TOP3" type="console" />
    </section>
  );
}
