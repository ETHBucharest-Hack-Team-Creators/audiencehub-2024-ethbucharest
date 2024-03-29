"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CreatorInfo from "~~/components/CreatorInfo";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

type TabData = {
  label: string;
  content: string;
};

export default function Page() {
  // const [contentList, setContentList] = useState([]);
  // const [creatorData, setCreatorData] = useState({
  //   address: "",
  //   imgUrl: "",
  //   bannerURL: "",
  //   name: "",
  //   description: "",
  //   price: 0,
  // });
  // const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  const tabs: TabData[] = [
    { label: "Tab 1", content: "Tab content 1" },
    { label: "Tab 2", content: "Tab content 2" },
    { label: "Tab 3", content: "Tab content 3" },
  ];

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="py-5 px-2">
      <CreatorInfo />
      <div role="tablist" className="tabs tabs-lifted">
        {tabs.map((tab, index) => (
          // Fragment to group each tab input and content without adding extra nodes
          <React.Fragment key={index}>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label={tab.label}
              checked={activeTabIndex === index}
              onChange={() => setActiveTabIndex(index)} // Set this tab as active when changed
            />
            {activeTabIndex === index && (
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                {tab.content}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* <ul>
        {contentList.map((item: CardProps) => (
          <ContentCard key={item.id} title={item.title} description={item.description} imgUrl={item.imgUrls[0]} />
        ))}
      </ul> */}
    </div>
  );
}
