"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTransactionReceipt } from "viem/_types/actions/public/getTransactionReceipt";
import { waitForTransactionReceipt } from "viem/_types/actions/public/waitForTransactionReceipt";
import { useAccount, useWaitForTransaction } from "wagmi";
import ApproveToken from "~~/components/ApproveToken";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import  { useRouter } from "next/navigation";
import { notification } from "~~/utils/scaffold-eth";
import { BuyNow } from "~~/components/BuyNow";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { currencies } from "~~/config/currency";
import { storageChains } from "~~/config/storage-chains";
import { useWalletClient } from "wagmi";
import { providers } from "ethers";
import { useSendTransaction } from "wagmi";
import { parseUnits, zeroAddress } from 'viem';
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import ShopItem from "~~/components/ShopItem";

export default function Page({ params }: { params: { creator: string } }) {

//HANDLE BUTTON PAY SUBSCRIPTION
//HANDLE BUTTON PAY ONE TIME ITEM
//POST REQUEST ID TO DATABASE IF SUCCESS WITH THE CORESPONDENT DATA 


  const [streamId, setStreamId] = useState("") as any;
  const [streamOwner, setStreamOwner] = useState("") as any;
  const [isStreamOwner, setIsStreamOnwer] = useState(false) as any;
  const [requestDataProps, setRequestDataProps] = useState({} as any);

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
  const [expectedAmount, setExpectedAmount] = useState("");

  const [status, setStatus] = useState(APP_STATUS.AWAITING_INPUT);
  const [storageChain, setStorageChain] = useState(
    storageChains.keys().next().value,
  );

  const [requestData, setRequestData] =
    useState<Types.IRequestDataWithEvents>();
//IT'S ABOUT PROVIDER
//AMOUNT IS 10 DAI , TO MODIFY WITH PARAMETERS


  const {address} = useAccount()

  const singleItemPrice = "0.005";
   const subscriptionPrice = parseUnits(singleItemPrice, 18);
  


  const payeeIdentity = address as string;
const payerIdentity = address;
const paymentRecipient = payeeIdentity;
const feeRecipient = '0x0000000000000000000000000000000000000000';



async function createRequest() {
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
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A",
        network: "sepolia",
      },
      //PRICE VARIABLE
      expectedAmount: parseUnits(
   singleItemPrice,
        18
      ).toString(),
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
      reason: "bought",
      dueDate: "12.12.2039",
      builderId: "request-network",
      createdWith: "CodeSandBox",
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
  notificationId = notification.loading("Persisting to IPFS")
    const request = await requestClient.createRequest(
      requestCreateParameters,
    );

  
    notification.remove(notificationId);
   const nofiticationIdPersisting = notification.loading("  Persisting on chain")
    setStatus(APP_STATUS.PERSISTING_ON_CHAIN);
    setRequestData(request.getData());
    const confirmedRequestData = await request.waitForConfirmation();
    notification.remove(nofiticationIdPersisting);
    notification.success(" Request confirmed")
    setStatus(APP_STATUS.REQUEST_CONFIRMED);
    setRequestDataProps(request);
    setRequestData(confirmedRequestData);
    
    let notificationSendTx;
    notificationSendTx = notification.loading("Sending Transaction");
 

    //PRICE VARIABLE
    sendTransactionAsync({ to: address as string, value: parseUnits(singleItemPrice, 18) });
     
  
   notification.remove(notificationSendTx);
    
   await delay(2000);
   if(!isLoading && !isError) {

   let notificationLoadingDeclaring;
   notificationLoadingDeclaring = notification.loading("Declaring sent payment");
   notification.remove(notificationLoadingDeclaring);


    await request.declareSentPayment(singleItemPrice, 'sent payment', {
      type: "ethereumAddress" as any,
      value: address as string,
    })
    notification.success("Payment declared successfully")
  }

  } catch (err) {
    alert("Error occurred")
    setStatus(APP_STATUS.ERROR_OCCURRED);
    alert(err);
  }
}

useEffect(() => {
  isSuccess && notification.success(`Transaction buying success`);
  isError && notification.error(`Transaction buying failed`);
}, [isSuccess])





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

  const { data: isOwner } = useScaffoldContractRead({
    contractName: "Sablier",
    functionName: "getSender",
    args: [streamId],
    watch: true,
  });



 
  //create stream
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "Sablier",
    functionName: "createWithDurations",

    args: [
      [
        address,
        "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d",
        subscriptionPrice,
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
  });

  // check for event
  useScaffoldEventSubscriber({
    contractName: "Sablier",
    eventName: "CreateLockupLinearStream",
    // The listener function is called whenever a GreetingChange event is emitted by the contract.
    // Parameters emitted by the event can be destructed using the below example
    // for this example: event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
    listener: logs => {
      logs.map(log => {
        const args = log.args;
        const sender = log.args[0];
        if (sender === address) {
          var StreamIdString = parseFloat(log.args[3] as string); // or parseInt(str) if you want an integer

          setStreamId(StreamIdString);
          setStreamOwner(address);


          console.log("Sender", true);

          
          //post stream id here in database

          //redirect to creatorpage
          notification.success("Subscription created, redirecting to creator content")

          //replace with new url on deployment
           router.push(`http://localhost:3000/audiencehub/creator-content/${params.creator}`);
        
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
            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <div className="flex justify-center mt-5 font-bold">{params.creator} </div>

        {streamOwner !== false && (
          <div>
            {connectedAddressCounter && connectedAddressCounter > subscriptionPrice ? (
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


        {
         isStreamOwner && (
          <div>
            <Link href={"/"}>
              <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl"> Go To Creator Content </button>
            </Link>
          </div>
         )

        }
        

        

        <div className="grid grid-cols-1 items-center align-middle">
          <div className="flex justify-center mt-5 font-bold">Merch & Items </div>
          <div className="grid grid-cols-4 space-x-auto  mt-5">
           {/* //.map, with fetched data, price, image, name, description  */}
<ShopItem createRequest={createRequest} />
<ShopItem createRequest={createRequest} />
<ShopItem createRequest={createRequest} />
<ShopItem createRequest={createRequest} />

          </div>
        </div>
      </div>
    </>
  );
}
