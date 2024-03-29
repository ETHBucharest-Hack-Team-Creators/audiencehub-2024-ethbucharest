"use client";

import React from "react";
import Link from "next/link";

const Page = () => {
  const [userType, setUserType] = React.useState("fan");
  return (
    <>
      <div className="flex py-8 justify-center gap-5">
        <button
          className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl"
          onClick={() => {
            setUserType("fan");
          }}
        >
          Fan
        </button>
        <button
          className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl"
          onClick={() => {
            setUserType("creator");
          }}
        >
          Creator
        </button>
      </div>
      <div className="px-12 pt-5">
        {(() => {
          if (userType === "fan") {
            return (
              <div className="overflow-x-auto shadow-md">
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
            );
          } else {
            return (
              <>
                <div>
                  <h1 className="text-3xl pb-4">Your Loyal Fans</h1>
                </div>
                <div className="overflow-x-auto shadow-md">
                  <table className="table table-zebra-zebra">
                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <td>
                          <div className="font-bold pl-1">0x82A29547CA8970c2aDECF4C2db7e364339f9a4B7</div>
                        </td>
                        <td>
                          <div className="font-bold pl-1">Closed</div>
                        </td>
                        <td>
                          <div className="font-bold pl-1">
                            <button className="btn btn-sm">Sign Receipt</button>
                          </div>
                        </td>
                      </tr>
                      {/* row 2 */}
                      <tr>
                        <td>
                          <div className="font-bold pl-1">blackicon.eth</div>
                        </td>
                        <td>
                          <div className="font-bold pl-1">Closed</div>
                        </td>
                        <td>
                          <div className="font-bold pl-1">
                            <button className="btn btn-sm">See Receipt</button>
                          </div>
                        </td>
                      </tr>
                      {/* row 3 */}
                      <tr>
                        <td>
                          <div className="font-bold pl-1">vitalik.eth</div>
                        </td>
                        <td>
                          <div className="font-bold pl-1">Expiring in 30 days</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            );
          }
        })()}
      </div>
    </>
  );
};

export default Page;
