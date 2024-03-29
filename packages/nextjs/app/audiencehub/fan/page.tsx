"use client";

import React, { useState } from "react";
import FanItemsTab from "~~/components/FanItemsTab";
import FanSubscriptionsTab from "~~/components/FanSubscriptionsTab";

export default function Page() {
  // State to track the currently active tab index
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1); // Default to first tab as active

  return (
    <div className="py-5 px-2">
      <div role="tablist" className="tabs tabs-lifted">
        <React.Fragment key="1">
          <input
            type="radio"
            name="dashboard"
            role="tab"
            className="tab"
            aria-label="Dashboard"
            checked={activeTabIndex === 1}
            onChange={() => setActiveTabIndex(1)} // Set this tab as active when changed
          />
          {activeTabIndex === 1 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <p>dashboard</p>
            </div>
          )}
        </React.Fragment>
        <React.Fragment key="2">
          <input
            type="radio"
            name="subscriptions"
            role="tab"
            className="tab"
            aria-label="Subscriptions"
            checked={activeTabIndex === 2}
            onChange={() => setActiveTabIndex(2)} // Set this tab as active when changed
          />
          {activeTabIndex === 2 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <FanSubscriptionsTab />
            </div>
          )}
        </React.Fragment>
        <React.Fragment key="3">
          <input
            type="radio"
            name="items"
            role="tab"
            className="tab"
            aria-label="Items"
            checked={activeTabIndex === 3}
            onChange={() => setActiveTabIndex(3)} // Set this tab as active when changed
          />
          {activeTabIndex === 3 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <FanItemsTab />
            </div>
          )}
        </React.Fragment>
      </div>
    </div>
  );
}
