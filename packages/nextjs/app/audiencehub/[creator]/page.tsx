"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { providers } from "ethers";
import { parseEther, parseUnits, zeroAddress } from "viem";
import { getTransactionReceipt } from "viem/_types/actions/public/getTransactionReceipt";
import { waitForTransactionReceipt } from "viem/_types/actions/public/waitForTransactionReceipt";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useWalletClient } from "wagmi";
import { useSendTransaction } from "wagmi";
import ApproveToken from "~~/components/ApproveToken";
import { BuyNow } from "~~/components/BuyNow";
import ShopItem from "~~/components/ShopItem";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { currencies } from "~~/config/currency";
import { storageChains } from "~~/config/storage-chains";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

export default function Page({ params }: { params: { creator: string } }) {
  //HANDLE BUTTON PAY SUBSCRIPTION
  //HANDLE BUTTON PAY ONE TIME ITEM
  //POST REQUEST ID TO DATABASE IF SUCCESS WITH THE CORESPONDENT DATA

  const [streamId, setStreamId] = useState("") as any;
  const [streamOwner, setStreamOwner] = useState("") as any;
  const [isStreamOwner, setIsStreamOnwer] = useState(false) as any;
  const [requestDataProps, setRequestDataProps] = useState();

  const router = useRouter() as any;

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  enum APP_STATUS {
    AWAITING_INPUT = "awaiting input",
    SUBMITTING = "submitting",
    PERSISTING_TO_IPFS = "persisting to ipfs",
    PERSISTING_ON_CHAIN = "persisting on-chain",
    REQUEST_CONFIRMED = "request confirmed",
    ERROR_OCCURRED = "error occurred",
  }

  const {
    data: hash,
    isLoading,
    isSuccess,
    isError,

    sendTransaction,
    sendTransactionAsync,
  } = useSendTransaction();

  const { data: walletClient } = useWalletClient();
  const [currency, setCurrency] = useState(currencies.keys().next().value);
  const [creatorItemsState, setCreatorItemsState] = useState([]);

  const [status, setStatus] = useState(APP_STATUS.AWAITING_INPUT);
  const [storageChain, setStorageChain] = useState(storageChains.keys().next().value);

  const [creatorDataState, setCreatorDataState] = useState({} as any);

  const [requestData, setRequestData] = useState<Types.IRequestDataWithEvents>();

  const [requestIdState, setRequestIdState] = useState("");
  //IT'S ABOUT PROVIDER
  //AMOUNT IS 10 DAI , TO MODIFY WITH PARAMETERS

  let requestDataForDb: any;

  const { address } = useAccount();

  const { postRequestIdCreator, postRequestIdFan, getItems, getCreatorData } = useFB();
  // const items =  getItems(params.creator);

  //GET ITEMS DATA FROM CREATOR
  // items -> address ( creator ) -> items ids
  // display them

  //FETCH CREATOR PROFILE DISPLAY PROFILE PICTURE

  useEffect(() => {
    const fetchDataItems = async () => {
      try {
        const address = params.creator; // Set your address here
        console.log(address);
        const itemsData = await getItems(params.creator);
        setCreatorItemsState(itemsData);
        console.log(itemsData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchDataCreator = async () => {
      try {
        const address = params.creator; // Set your address here
        console.log(address);
        const itemsData = await getCreatorData(params.creator);
        setCreatorDataState(itemsData as any);
        console.log("-----------CREATOR DATA------------");
        console.log(itemsData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchDataCreator();
    fetchDataItems(); // Call fetchData when component mounts
    console.log("-------------CREATOR DATA STATE-------------");
    console.log(creatorDataState);
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {}, [creatorItemsState]);

  //FETCH FROM DB
  // const singleItemPrice = "0.005";
  //FETCH FROM DB
  const subscriptionPriceForRequest: string = "1";
  const subscriptionPrice = parseUnits(subscriptionPriceForRequest, 18);

  const payeeIdentity = address as string;
  const payerIdentity = address;
  const paymentRecipient = payeeIdentity;
  const feeRecipient = "0x0000000000000000000000000000000000000000";

  async function createRequest(
    reason: string,
    isOneTimePayment: boolean,
    streamId?: string,
    itemId?: string,
    price?: any,
  ) {
    const signatureProvider = new Web3SignatureProvider(walletClient);
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
      signatureProvider,
      // httpConfig: {
      //   getConfirmationMaxRetry: 40, // timeout after 120 seconds
      // },
    });
    const requestCreateParameters: Types.ICreateRequestParameters = {
      requestInfo: {
        currency: {
          type: isOneTimePayment ? Types.RequestLogic.CURRENCY.ETH : Types.RequestLogic.CURRENCY.ERC20,
          value: "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A",
          network: "sepolia",
        },
        //PRICE VARIABLE
        expectedAmount: isOneTimePayment ? parseEther(price).toString() : "1",
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address as string,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: "sepolia",
          paymentAddress: paymentRecipient || address,
          feeAddress: zeroAddress,
          feeAmount: "0",
        },
      },
      contentData: {
        // Consider using rnf_invoice format from @requestnetwork/data-format package.
        reason: reason,
        dueDate: "12.12.2039",
        builderId: "audiencehub",
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address as string,
      },
    };

    if (payerIdentity && payerIdentity.length > 0) {
      requestCreateParameters.requestInfo.payer = {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      };
    }

    try {
      let notificationId = null;
      setStatus(APP_STATUS.PERSISTING_TO_IPFS);
      notificationId = notification.loading("Persisting to IPFS");
      const request = await requestClient.createRequest(requestCreateParameters);

      notification.remove(notificationId);
      const nofiticationIdPersisting: any = notification.loading("  Persisting on chain");
      requestDataForDb = request.requestId;
      setRequestIdState(request.requestId);
      console.log("-----------REQUEST DATA SENT TO SABLIER DB PERSISTING ON CHAIN------------");
      console.log(requestIdState);
      console.log(requestDataForDb);
      setStatus(APP_STATUS.PERSISTING_ON_CHAIN);
      setRequestData(request.getData());
      const confirmedRequestData = await request.waitForConfirmation();
      notification.remove(nofiticationIdPersisting);
      notification.success(" Request confirmed");
      setStatus(APP_STATUS.REQUEST_CONFIRMED);
      // setRequestDataProps(request);
      // console.log('-----------REQUEST CONFIRMED DATA SENT TO SABLIER DB------------')
      // requestDataForDb = confirmedRequestData;
      // // setRequestData(requestData);
      // console.log(requestDataForDb)
      let notificationSendTx;
      notificationSendTx = notification.loading("Sending Transaction");

      //PRICE VARIABLE
      if (isOneTimePayment) {
        sendTransactionAsync({ to: address as string, value: parseUnits(price, 18) });
      }

      notification.remove(notificationSendTx);

      await delay(2000);
      if (!isLoading && !isError) {
        let notificationLoadingDeclaring;
        notificationLoadingDeclaring = notification.loading("Declaring sent payment");

        try {
          const pricedeclare = isOneTimePayment ? price : subscriptionPriceForRequest;
          await request.declareSentPayment(parseEther(pricedeclare).toString(), "sent payment", {
            type: "ethereumAddress" as any,
            value: address as string,
          });
        } catch (e) {
          notification.error("Error to declare");
        }

        try {
          if (isOneTimePayment === true) {
            postRequestIdCreator(params.creator, request.requestId, true, 100, itemId);
            postRequestIdFan(address as string, request.requestId, true, 100, itemId);
            notification.remove(notificationLoadingDeclaring);
            notification.success("Payment declared successfully");
          } else {
            console.log("Subscription payment");
            postRequestIdFan(address as string, request.requestId, false, streamId, itemId);
            postRequestIdCreator(params.creator, request.requestId, false, streamId, itemId);
            notification.remove(notificationLoadingDeclaring);
            notification.success("Payment declared successfully");
            router.push(`/audiencehub/creator-content/${params.creator}`);
          }
        } catch (e) {
          notification.error("Error to db");
        }
      }
    } catch (err) {
      alert("Error occurred");
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
    }
  }

  useEffect(() => {
    isSuccess && notification.success(`Transaction buying success`);
    isError && notification.error(`Transaction buying failed`);
  }, [isSuccess]);

  useEffect(() => {
    console.log(params);
  }, []);

  const sablier_Address = "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301";

  //check for allownce of dai
  const { data: connectedAddressCounter } = useScaffoldContractRead({
    contractName: "DAI",
    functionName: "allowance",
    args: [address, sablier_Address],
    watch: true,
  });

  // check for NFT STREAM SENDER as USER ownership

  //create stream
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "Sablier",
    functionName: "createWithDurations",

    args: [
      [
        address,
        "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d",
        parseUnits(subscriptionPriceForRequest, 18),
        "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A",
        true,
        true,
        [0, 2592000],
        ["0x0000000000000000000000000000000000000000", 0],
      ],
    ],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
    onSuccess: data => {
      console.log("Success", data);
    },
  });

  // check for event
  useScaffoldEventSubscriber({
    contractName: "Sablier",
    eventName: "CreateLockupLinearStream",
    // The listener function is called whenever a GreetingChange event is emitted by the contract.
    // Parameters emitted by the event can be destructed using the below example
    // for this example: event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
    listener: logs => {
      console.log("Listener");
      console.log(logs);
      logs.map(log => {
        const args = log.args;
        const sender = log.args[0];
        if (sender === address) {
          var StreamIdString = parseFloat(log.args[3] as string); // or parseInt(str) if you want an integer
          const streamIdStringToDb = StreamIdString.toString();
          console.log("------DATA SENT TO DB------");
          console.log([params.creator, requestIdState, streamIdStringToDb, false]);

          createRequest("Subscription", false, streamIdStringToDb, "subscriptiion", creatorDataState.price);

          //we check if they are subscriberd, if yes show if no dont show
        }
        const streamId = log.args[3];
        console.log("Event emitted ", args);
        console.log("StreamId : ", streamId);
      });
    },
  });

  return (
    <>
      <div className="grid grid-cols-1 items-center align-middle mt-12 justify-items-center">
        <div className="avatar flex justify-center">
          <div className="w-24 mask mask-hexagon">
            {/* //@ts-ignore */}
            {creatorDataState ? <img src={creatorDataState.imgUrl} /> : <div>Loading</div>}
          </div>
        </div>
        {/* //@ts-ignore */}
        <div className="flex justify-center mt-5 font-bold">
          {creatorDataState ? creatorDataState.name : params.creator}{" "}
        </div>

        {streamOwner !== false && (
          <div>
            {true ? (
              //Subscribe button Sablier
              <button
                className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl"
                onClick={() => writeAsync()}
              >
                Subscribe{" "}
              </button>
            ) : (
              <ApproveToken />
            )}
          </div>
        )}

        {isStreamOwner && (
          <div>
            <Link href={"/"}>
              <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl">
                {" "}
                Go To Creator Content{" "}
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 items-center align-middle">
          <div className="flex justify-center pt-11 font-bold">Merch & Items </div>

          <div className="grid grid-cols-4 space-x-auto  mt-5">
            {/* //.map, with fetched data, price, image, name, description  */}

            {creatorItemsState ? (
              creatorItemsState.map((item: any, key: any) => (
                <div key={key}>
                  <ShopItem
                    createRequest={createRequest}
                    image={item.imgUrl}
                    description={item.description}
                    title={item.title}
                    price={item.price}
                    itemId={item.id}
                  />
                </div>
              ))
            ) : (
              <div>Loading</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
