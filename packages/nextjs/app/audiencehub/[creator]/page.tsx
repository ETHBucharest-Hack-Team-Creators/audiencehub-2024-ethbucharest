"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTransactionReceipt } from "viem/_types/actions/public/getTransactionReceipt";
import { waitForTransactionReceipt } from "viem/_types/actions/public/waitForTransactionReceipt";
import { useAccount } from "wagmi";
import ApproveToken from "~~/components/ApproveToken";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import  { useRouter } from "next/navigation";
import { notification } from "~~/utils/scaffold-eth";
import { BuyNow } from "~~/components/BuyNow";

export default function Page({ params }: { params: { creator: string } }) {
  const [streamId, setStreamId] = useState("") as any;
  const [streamOwner, setStreamOwner] = useState("") as any;
  const [isStreamOwner, setIsStreamOnwer] = useState(false) as any;
  const price = 10000000000000000;
  const router = useRouter() as any;
  const { address } = useAccount();

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

  //check for NFT STREAM SENDER as USER ownership

  const { data: isOwner } = useScaffoldContractRead({
    contractName: "Sablier",
    functionName: "getSender",
    args: [streamId],
    watch: true,
  });



 
  //create stream
  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "Sablier",
    functionName: "createWithDurations",

    args: [
      [
        address,
        "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d",
        price,
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
            {connectedAddressCounter && connectedAddressCounter > price ? (
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
          <div className="card w-72 bg-base-100 shadow-xl mx-5">
  <figure className="px-10 pt-10">
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
<div className="card w-72 bg-base-100 shadow-xl mx-5">
  <figure className="px-10 pt-10">
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
<div className="card w-72 bg-base-100 shadow-xl mx-5">
  <figure className="px-10 pt-10">
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
<div className="card w-72 bg-base-100 shadow-xl mx-5">
  <figure className="px-10 pt-10">
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions">
      <BuyNow address={`${address}`} />
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </>
  );
}
