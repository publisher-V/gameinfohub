"use client";
import { useState } from "react";

import BasicTab from "../ui/basic-tab/basic-tab";
import RankList from "../rank-list/rank-list";

type MainRankWrapperProps = {
  title: string;
  tabs?: string[];
  type: "game" | "console";
};

export default function MainRankWrapper({ title, tabs, type }: MainRankWrapperProps) {
  const [activeTab, setActiveTab] = useState<string | undefined>(tabs?.[0]);

  return (
    <section id="mainRankWrapper" className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      {tabs && <BasicTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />}
      <RankList type={type} />
    </section>
  );
}
