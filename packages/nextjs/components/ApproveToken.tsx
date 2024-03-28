import React from 'react'
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth';

const ApproveToken = () => {
    const sablier_Address = "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301"


    
    const { writeAsync, isLoading, isMining, error } = useScaffoldContractWrite({
   
        contractName: "DAI",
        functionName: "increaseAllowance",
    
      args: ["0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301", "10000000000000000000000"],
        blockConfirmations: 1,
        onBlockConfirmation: txnReceipt => {
          console.log("Transaction blockHash", txnReceipt.blockHash);
        },
      });

  return (
    <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => writeAsync()}>Approve</button>
  )
}

export default ApproveToken