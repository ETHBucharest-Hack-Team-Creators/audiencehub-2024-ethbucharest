"use client";

import { useEffect, useState } from "react";
import { getTransactionReceipt } from "viem/_types/actions/public/getTransactionReceipt";
import { waitForTransactionReceipt } from "viem/_types/actions/public/waitForTransactionReceipt";
import { useAccount } from "wagmi";
import ApproveToken from "~~/components/ApproveToken";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";


export default function Page({ params }: { params: { creator: string } }) {
    const [streamId, setStreamId] = useState("") as any;

  const price = 10000000000000000;

    const {address} = useAccount();


  useEffect(() => {
    console.log(params);
  }, []);

  
const sablier_Address = "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301"



//check for allownce of dai
  const { data: connectedAddressCounter } = useScaffoldContractRead({
    contractName: "DAI",
    functionName: "allowance",
    args: [address, sablier_Address],
    watch: true
  });

  //check for nft ownership
  const { data: isOwner } = useScaffoldContractRead({
    contractName: "DAI",
    functionName: "allowance",
    args: [address, sablier_Address],
    watch: true
  });


//create stream
  const { writeAsync, isLoading, isMining} = useScaffoldContractWrite({

    contractName: "Sablier",
    functionName: "createWithDurations",

  args: [[address, "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d", price, "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A", true, true, [0,2592000], ["0x0000000000000000000000000000000000000000",0]]],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);

    },
    onSettled(data, error) {
      console.log('Settled', { data, error })
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
      if(sender === address) {
        setStreamId(log.args[3])

        //post stream id here in database

        console.log("Sender", true)
      } 
      const streamId = log.args[3];
      console.log("Event emitted ", args);
      console.log("StreamId : ", streamId)
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
        
        <p>{connectedAddressCounter && connectedAddressCounter > price  ? 
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => writeAsync()}>Subscribe </button>
        :   <ApproveToken /> }</p>
     
      </div>
    </>
  );
}
