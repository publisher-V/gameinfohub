type tabsProps = {
  tabs: string[];
  activeTab?: string;
  setActiveTab: (tab: string) => void;
};

export default function BasicTab({ tabs, activeTab, setActiveTab }: tabsProps) {
  const buttonStyle = "h-[50px] px-2 cursor-pointer text-sm font-bold text-zinc-500 hover:text-[#702a1a] [&.active]:text-[#702a1a]";

  const changeActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <nav aria-label="Metacritic platforms">
      <ul className="flex gap-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <li className="flex min-w-max gap-1" key={tab}>
            <button type="button" className={`${buttonStyle} ${activeTab === tab ? "active" : ""}`} onClick={() => changeActiveTab(tab)}>
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
