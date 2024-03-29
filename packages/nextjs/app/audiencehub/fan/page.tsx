"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

export default function Page() {
  const { address } = useAccount();
  const { getFanSubscriptions } = useFB();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!address) return;
    const fetchData = async (address: string) => {
      try {
        const requests = await getFanSubscriptions(address);
        setRequests(requests);
        console.log(requests);
      } catch (error) {
        notification.error("Something went wrong");
      }
    };
    fetchData(address);
  }, [address]);

  // State to track the currently active tab index
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1); // Default to first tab as active

  return (
    <div className="py-5 px-2">
      <div role="tablist" className="tabs tabs-lifted">
        <React.Fragment key="1">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Your Subscriptions"
            checked={activeTabIndex === 1}
            onChange={() => setActiveTabIndex(1)} // Set this tab as active when changed
          />
          {activeTabIndex === 1 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <div className="overflow-x-auto shadow-md rounded-xl">
                <table className="table table-zebra-zebra">

                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <Link href={"/audiencehub/robert"}>
                            <div className="avatar">
                              <div className="mask mask-hexagon w-16 h-16">
                                <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                              </div>
                            </div>
                          </Link>
                          <div>
                            <Link href={"/audiencehub/robert"}>
                              <div className="font-bold pl-1">Fish man</div>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-hexagon w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-hexagon w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                    {/* row 4 */}
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-hexagon w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </React.Fragment>
        <React.Fragment key="2">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Your Items"
            checked={activeTabIndex === 2}
            onChange={() => setActiveTabIndex(2)} // Set this tab as active when changed
          />
          {activeTabIndex === 2 && (
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              {requests.map((request: any, index: number) => (
                <div key={index}>{request.requestid}</div>
              ))}
            </div>
          )}
        </React.Fragment>
      </div>
    </div>
  );
}
