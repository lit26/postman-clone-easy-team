import React from "react";

interface TabGroupProps {
  tabItems: string[];
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  name: string;
}

const TabGroup: React.FC<TabGroupProps> = ({ tabItems, tab, setTab, name }) => {
  return (
    <ul className="nav nav-tabs" role="tablist">
      {tabItems.map((tabItem, index) => (
        <li
          key={`${name}Tab_${tabItem}`}
          className="nav-item"
          role="presentation"
        >
          <button
            className={`nav-link ${tab === index ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => setTab(index)}
          >
            {tabItem}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabGroup;
