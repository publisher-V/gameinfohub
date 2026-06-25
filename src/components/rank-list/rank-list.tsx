import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import bestSellingConsoleData from "@/app/data/best-selling-console.json";
import bestSellingGameData from "@/app/data/best-selling-game.json";

// type listProps = {
//   activeTab?: string;
// };

type RankListProps = {
  type: "game" | "console";
};

type RankItem = {
  id: number;
  title: string;
  score: string;
  releaseDate: string;
  url: string;
  rank: string;
  cavity?: boolean;
};

type RankData = {
  items: RankItem[];
};

export default function RankList({ type }: RankListProps) {
  const dataMaps: Record<"game" | "console", RankData> = {
    console: bestSellingConsoleData,
    game: bestSellingGameData,
  };

  const currentData = dataMaps[type];
  const filteredData = currentData.items.slice(0, 3);
  // const metaData = {
  //   pc: pcMetaScoreItems,
  //   ps5: ps5MetaScoreItems,
  //   xbox: xboxMetaScoreItems,
  //   "nintendo switch": switchMetaScoreItems,
  //   "nintendo switch2": switch2MetaScoreItems,
  // };
  // const currentData = metaData[activeTab as keyof typeof metaData];
  return (
    <ul className="main-metacritic-list">
      {filteredData.length === 0 && <li className="border-t-1 py-4 text-sm text-zinc-500">{"Metacritic 데이터를 불러오지 못했습니다."}</li>}
      {filteredData.map((item) => (
        <li key={item.id} className="border-t-1 h-25">
          <Link className="flex flex-col w-full h-full py-4 hover:text-[#702a1a]" href={item.url} target="_blank" rel="noopener noreferrer">
            <p className="mb-2 line-clamp-1">
              <span>
                {item.rank}
                {item.cavity && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <sup>ⓘ</sup>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>출처별 집계 기준 차이로 테트리스와 마인크래프트를 동일 순위로 표기했습니다.</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
              <span className="mr-1">.</span>
              {item.title}
            </p>
            <p className="text-sm text-zinc-500">판매량 : {item.score}</p>
            <p className="text-sm text-zinc-500">출시년도 : {item.releaseDate}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
