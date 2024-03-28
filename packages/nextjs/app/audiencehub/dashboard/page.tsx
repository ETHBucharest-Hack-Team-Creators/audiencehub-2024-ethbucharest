"use client"
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [userType, setUserType] = React.useState("fan");
  const router = useRouter();
  return (
    <>
      <div className="flex py-8 justify-center gap-5">
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => {setUserType("fan")}}>Fan</button>
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => {setUserType("creator")}}>Creator</button>
      </div>
      <div className="px-12 pt-5">
        {(() => {
          if (userType === "fan") {
            return (
              <div className="overflow-x-auto">
                <table className="table table-zebra-zebra">
                  <tbody>
                    {/* row 1 */}
                    <tr onClick={() => router.push("/audiencehub/robert")}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="rounded-full w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-ghost btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                    {/* row 2 */}
                    <tr onClick={() => router.push("/")}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="rounded-full w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-ghost btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                    {/* row 3 */}
                    <tr onClick={() => router.push("/")}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="rounded-full w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-ghost btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                    {/* row 4 */}
                    <tr onClick={() => router.push("/")}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="rounded-full w-16 h-16">
                              <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold pl-1">Fish man</div>
                          </div>
                        </div>
                      </td>
                      <th>
                        <button className="btn btn-ghost btn-sm">Close Subscription</button>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          } else {
            return (
              <div>
                <h1 className="text-3xl">Creator Dashboard</h1>
                <p className="text-xl">Welcome to the creator dashboard</p>
              </div>
            );
          }
        })()}
      </div>
    </>
  );
};

export default Page;
