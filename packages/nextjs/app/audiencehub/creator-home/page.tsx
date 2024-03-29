"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import { useAccount } from "wagmi";
import ContentTab from "~~/components/ContentTab";
import CreatorInfo from "~~/components/CreatorInfo";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

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

  // const { address } = useAccount();

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="py-5 px-2">
      <CreatorInfo />
      <div role="tablist" className="tabs tabs-lifted">
        <React.Fragment key={0}>
          <input
            type="radio"
            name="dashboard_tab"
            role="tab"
            className="tab"
            aria-label="Dashboard"
            checked={activeTabIndex === 0}
            onChange={() => setActiveTabIndex(0)} // Set this tab as active when changed
          />
          {activeTabIndex === 0 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              Dashboard
            </div>
          )}
        </React.Fragment>

        <React.Fragment key={1}>
          <input
            type="radio"
            name="content_tab"
            role="tab"
            className="tab"
            aria-label="Content"
            checked={activeTabIndex === 1}
            onChange={() => setActiveTabIndex(1)} // Set this tab as active when changed
          />
          {activeTabIndex === 1 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <ContentTab />
            </div>
          )}
        </React.Fragment>

        <React.Fragment key={2}>
          <input
            type="radio"
            name="items_tab"
            role="tab"
            className="tab"
            aria-label="Dashboard"
            checked={activeTabIndex === 2}
            onChange={() => setActiveTabIndex(2)} // Set this tab as active when changed
          />
          {activeTabIndex === 2 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              Items
            </div>
          )}
        </React.Fragment>
      </div>

      {/* <ul>
        {contentList.map((item: CardProps) => (
          <ContentCard key={item.id} title={item.title} description={item.description} imgUrl={item.imgUrls[0]} />
        ))}
      </ul> */}
    </div>
  );
}
