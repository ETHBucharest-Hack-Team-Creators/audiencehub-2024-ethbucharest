"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import ContentTab from "~~/components/ContentTab";
import CreatorInfo from "~~/components/CreatorInfo";
import ItemsTab from "~~/components/ItemsTab";
import DashboardCreator from "~~/components/dashboard/DashboardCreator";

export default function Page() {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const { address } = useAccount();

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
              <DashboardCreator addressOfUser={address} />
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
            aria-label="Items"
            checked={activeTabIndex === 2}
            onChange={() => setActiveTabIndex(2)}
          />
          {activeTabIndex === 2 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <ItemsTab />
            </div>
          )}
        </React.Fragment>
      </div>
    </div>
  );
}
