
import React, { useEffect } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";


const WithDrawRemaning = ({streamId, withdrawAbleAmount}: any) => {

    const {address} = useAccount();
    const sablier_Address = "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301";
  
  
    useEffect(() => { 
      console.log('------STERAM ID---------')
     console.log(streamId)
    }, [streamId])
  

  
    const { writeAsync, isMining } = useScaffoldContractWrite({
      contractName: "Sablier",
      functionName: "withdraw",
  
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
    <div>
        {withdrawAbleAmount > 0 ?
       <button className="btn btn-sm" onClick={() => writeAsync()} >
       WithDraw Remaning
     </button> :
     <p>Withdrew</p>    
    }
     
     
        
        </div>
  )
}

export default WithDrawRemaning