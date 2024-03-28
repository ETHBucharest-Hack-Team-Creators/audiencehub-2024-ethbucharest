"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { providers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { storageChains } from "~~/config/storage-chains";
import { notification } from "~~/utils/scaffold-eth";

const Page = () => {
  //mock array of request IDs
  //Fetch request IDs from db, query user's address
  const requestIds = [
    "011c99c877b6fe4e8b953523c407f85568cc884a3e68cbab47b1a033a2895ec9e9",
    "01b451e626efc609cc07fbb96d68aca853dcb9dcb72d6d8acad04f2fb83b2afabb",
    "0196f638f5f320dd7eb600b1d5d9edd242d29281f5cdee815b29783baa542f3b26",
  ];

  const [userType, setUserType] = useState("fan");
  const [requestsData, setRequestsData] = useState([]);
  const [storageChain, setStorageChain] = useState(storageChains.keys().next().value);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestTest, setRequestTest] = useState();

  // get request Ids from database (subscriptions, array of request ids)
  async function getRequestIds() {
    console.log(walletClient);
    const signatureProvider = new Web3SignatureProvider(walletClient || (window.ethereum as any));
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
      signatureProvider,
      // httpConfig: {
      //   getConfirmationMaxRetry: 40, // timeout after 120 seconds
      // },
    });

    let requests = [];
    for (let i = 0; i < requestIds.length; i++) {
      const request = await requestClient.fromRequestId(requestIds[i]);

      const requestData = request.getData();
      console.log(request);

      const requestObject = {
        requestData: requestData,
        requestFunctions: request,
      };
      requests.push(requestObject);
    }
    setRequestsData(requests as any);
    console.log(requests);
    setLoadingRequests(false);
  }

  async function declarePaymentReceived(request: any, amount: any, addressValue: any) {
    console.log(request);

    try {
      let loadingNotif;
      loadingNotif = notification.loading("Declaring payment received");
      await request.declareReceivedPayment(amount, "sent payment", {
        type: "ethereumAddress" as any,
        value: addressValue as string,
      });

      notification.remove(loadingNotif);

      notification.success("Declaration complete");
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    setLoadingRequests(true);
    getRequestIds();
    console.log(requestsData);
  }, []);

  React.useEffect(() => {}, [walletClient, address]);

  return (
    <div>
      {loadingRequests ? (
        <div>loading</div>
      ) : (
        <div>
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
                              <div className="font-bold pl-1">Payer Address</div>
                            </td>
                            <td>
                              <div className="font-bold pl-1">Status</div>
                            </td>
                            <td>
                              <div className="font-bold pl-1">Action</div>
                            </td>
                          </tr>
                          {requestsData ? (
                            requestsData.map((request: any, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="font-bold pl-1">{request.requestData.payer.value}</div>
                                </td>
                                <td>
                                  <div className="font-bold pl-1">
                                    {request.requestData.extensionsData.length > 3 &&
                                    request.requestData.extensionsData[3].action === "declareReceivedPayment"
                                      ? "Declared"
                                      : request.requestData.state}
                                  </div>
                                </td>
                                <td>
                                  <div className="font-bold pl-1">
                                    {request.requestData.extensionsData.length > 3 &&
                                      request.requestData.extensionsData[3].action === "declareReceivedPayment" &&
                                      request.requestData.state === "created" && (
                                        <button
                                          className="btn btn-sm"
                                          onClick={() =>
                                           alert("Receipt already signed")
                                          }
                                        >
                                          Receipt
                                        </button>
                                      )}

                                      {
                                        request.requestData.extensionsData.length <= 3 && request.requestData.state === "created" &&  <button
                                        className="btn btn-sm"
                                        onClick={() =>
                                          declarePaymentReceived(
                                            request.requestFunctions,
                                            request.requestData.expectedAmount,
                                            request.requestData.payee.value,
                                          )
                                        }
                                      >
                                        Sign Receipt
                                      </button>
                                      }
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <div className="flex justify-center text-2xl ">Loading</div>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
