"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

type TabData = {
  label: string;
  content: string;
};

export default function Page({ params }: { params: { creator: string } }) {
  // const [contentList, setContentList] = useState([]);
  const [creatorData, setCreatorData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();
  const { getCreatorData } = useFB();

  useEffect(() => {
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
        const creator = await getCreatorData(address);
        if (creator && creator.error) {
          notification.error(creator.error);
          throw new Error(creator.error);
        }
        setCreatorData(creator);
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!address) return;
    fetchData(address);
  }, [address]);

  const tabs: TabData[] = [
    { label: "Tab 1", content: "Tab content 1" },
    { label: "Tab 2", content: "Tab content 2" },
    { label: "Tab 3", content: "Tab content 3" },
  ];

  // State to track the currently active tab index
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1); // Default to second tab as active

  return (
    <div className="py-5 px-2">
      <h1 className="text-2xl">Fan page</h1>
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
