"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import ApproveToken from "~~/components/ApproveToken";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";


export default function Page({ params }: { params: { creator: string } }) {


  const price = 10000000000000000;

    const {address} = useAccount();


  useEffect(() => {
    console.log(params);
  }, []);

  
const sablier_Address = "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301"



  const { data: connectedAddressCounter } = useScaffoldContractRead({
    contractName: "DAI",
    functionName: "allowance",
    args: [address, sablier_Address],
    watch: true
  });



  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({

    contractName: "Sablier",
    functionName: "createWithDurations",

  args: [[address, "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d", price, "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A", true, true, [0,2592000], ["0x0000000000000000000000000000000000000000",0]]],
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
        
        <p>{connectedAddressCounter > price ? 
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => writeAsync()}>Subscribe </button>
        :   <ApproveToken /> }</p>
     
      </div>
    </>
  );
}
