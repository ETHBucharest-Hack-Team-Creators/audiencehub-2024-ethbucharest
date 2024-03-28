"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";


export default function Page({ params }: { params: { creator: string } }) {

    const {address} = useAccount();


  useEffect(() => {
    console.log(params);
  }, []);


  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "Sablier",
    functionName: "createWithDurations",

  args: [[address, "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d", 10000000000000000000, "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A", true, true, [0,3600], [0x0000000000000000000000000000000000000000,0]]],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
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
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => writeAsync()}>Subscribe</button>
      </div>
    </>
  );
}
