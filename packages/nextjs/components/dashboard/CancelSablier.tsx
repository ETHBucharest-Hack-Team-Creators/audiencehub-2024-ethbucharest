import React, { useEffect } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import WithDrawRemaning from "./WithDrawRemaning";

const CancelSablier = ({streamId}: any) => {


  const {address} = useAccount();
  const sablier_Address = "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301";


  useEffect(() => { 
    console.log('------STERAM ID---------')
   console.log(streamId)
  }, [streamId])


  const { data: statusOf } = useScaffoldContractRead({
    contractName: "Sablier",
    functionName: "statusOf",
    args: [streamId],
  });

  const { data: withdrawAbleAmount } = useScaffoldContractRead({
    contractName: "Sablier",
    functionName: "withdrawableAmountOf",
    args: [streamId],
  });

  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "Sablier",
    functionName: "cancel",

    args: [
      streamId
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


  return (
    <td>

      {statusOf === 1 &&    <button className="btn btn-sm" onClick={() => writeAsync()} >
        Cancel Subscription
      </button> }
      {
        statusOf === 3 && withdrawAbleAmount > 0 &&   <WithDrawRemaning streamId={streamId} withdrawAbleAmount={withdrawAbleAmount} />
      }
    
    </td>
  );
};

export default CancelSablier;
