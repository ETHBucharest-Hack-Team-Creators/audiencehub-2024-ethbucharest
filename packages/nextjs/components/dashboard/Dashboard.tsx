
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { providers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { storageChains } from "~~/config/storage-chains";
import { notification } from "~~/utils/scaffold-eth";
import { useFB } from "~~/hooks/useFB";
const Dashboard = ({addressOfUser} : any) => {


      //mock array of request IDs
  //Fetch request IDs from db, query user's address
//   const requestIds = [
//     "011c99c877b6fe4e8b953523c407f85568cc884a3e68cbab47b1a033a2895ec9e9",
//     "01b451e626efc609cc07fbb96d68aca853dcb9dcb72d6d8acad04f2fb83b2afabb",
//     "0196f638f5f320dd7eb600b1d5d9edd242d29281f5cdee815b29783baa542f3b26",
//     "01ce2ff4994a4652eea39fb007fd19c748bbc4ef5e0580bac46bd655b680d9a7d5"
//   ];
  const [requestsData, setRequestsData] = useState([]);
  const [storageChain, setStorageChain] = useState(storageChains.keys().next().value);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestTest, setRequestTest] = useState();
  const [requestsCreatorIds, setRequestCreatorIds] = useState();
  const [requestsSubscriptionsState, setSubscriptionsState] = useState([]);
    const [requestsOneTimePaymentsState, setOneTimePaymentsState] = useState([]);

  // get request Ids from database (subscriptions, array of request ids)
  const {getRequestCreatorIds} = useFB();

  async function getRequestIds(requestsIdArray: string[], isSubscription: boolean) {
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
    for (let i = 0; i < requestsIdArray.length; i++) {
      const request = await requestClient.fromRequestId(requestsIdArray[i]);

      const requestData = request.getData();
      console.log(request);

      const requestObject = {
        requestData: requestData,
        requestFunctions: request,
      };
      requests.push(requestObject);
    }
    if(isSubscription) {
    setSubscriptionsState(requests as any);
    } else{ 
    setOneTimePaymentsState(requests as any);
    }
    console.log(requests);
    setLoadingRequests(false);
  }

  useEffect(() => {
    const fetchRequestIds = async () => {
        try {
           // Set your address here
          const subscriptionsRequestsIds: any = [];
          const oneTimeItemsRequestsIds: any = [];

          console.log(address);
          const itemsData = await getRequestCreatorIds(address as string);
          setRequestCreatorIds(itemsData as any);
          console.log("-----------CREATOR DATA------------");
          console.log(itemsData);

          for(let i = 0; i < itemsData.length; i++) {
            console.log(itemsData[i].requestid);
            if(itemsData[i].oneTimePayment === true) {
                oneTimeItemsRequestsIds.push(itemsData[i].requestid);

            } else {
                subscriptionsRequestsIds.push(itemsData[i].requestid);
       
            }
          }
          
          await getRequestIds(oneTimeItemsRequestsIds, false)
          await getRequestIds(subscriptionsRequestsIds, true)

          console.log(oneTimeItemsRequestsIds);
          console.log(subscriptionsRequestsIds);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };

      fetchRequestIds()
  
  },[address])

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

//subscriptions table
//one time payments table

    return (
        <>
          <div>
            <h1 className="text-3xl pb-4">Subscriptions</h1>
          </div>

{/* TABLE SUBCRIPTIONS */}
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
                {requestsSubscriptionsState ? (
                  requestsSubscriptionsState.map((request: any, index) => (
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


     {/* TABLE FANS */}     
     <div>
            <h1 className="text-3xl pb-4">Accept Item Orders</h1>
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
                {requestsOneTimePaymentsState ? (
                  requestsOneTimePaymentsState.map((request: any, index) => (
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

export default Dashboard