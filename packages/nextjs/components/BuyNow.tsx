import * as React from 'react'
import { 
  useAccount,
  useSendTransaction, 
   
} from 'wagmi' 
import { parseEther, parseUnits } from 'viem' 
import { useWalletClient } from "wagmi";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork } from "@requestnetwork/request-client.js"
import { Types, Utils } from "@requestnetwork/request-client.js";



 //creator's address
export function BuyNow({address, itemPrice} : any) {
  const { 
    data: hash, 
    isLoading, 
    sendTransaction 
  } = useSendTransaction() 

  const { data: walletClient } = useWalletClient();
  
  const web3SignatureProvider = new Web3SignatureProvider(walletClient);


  const requestClient = new RequestNetwork({
    nodeConnectionConfig: { 
      baseURL: "https://sepolia.gateway.request.network/",
    },
    signatureProvider: web3SignatureProvider,
  });

  const payeeIdentity = address;
const payerIdentity = address;
const paymentRecipient = payeeIdentity;
const feeRecipient = '0x0000000000000000000000000000000000000000';

const requestCreateParameters = {
  requestInfo: {
    
    // The currency in which the request is denominated
    currency: {
      type: Types.RequestLogic.CURRENCY.ERC20,
      value: '0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A',
      network: 'sepolia',
    },
    
    // The expected amount as a string, in parsed units, respecting `decimals`
    // Consider using `parseUnits()` from ethers or viem
    expectedAmount: parseUnits(itemPrice, 18),
    
    // The payee identity. Not necessarily the same as the payment recipient.
    payee: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
    
    // The payer identity. If omitted, any identity can pay the request.
    payer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerIdentity,
    },
    
    // The request creation timestamp.
    timestamp: Utils.getCurrentTimestampInSecond(),
  },
  
  // The paymentNetwork is the method of payment and related details.
  paymentNetwork: {
    id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
    parameters: {
      paymentNetworkName: 'sepolia',
      paymentAddress: payeeIdentity,
      feeAddress: feeRecipient,  
      feeAmount: '0',
    },
  },
  
  // The contentData can contain anything.
  // Consider using rnf_invoice format from @requestnetwork/data-format
  contentData: {
    reason: '🍕',
    dueDate: '2023.06.16',
  },
  
  // The identity that signs the request, either payee or payer identity.
  signer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: payeeIdentity,
  },
};

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    
    const to = address 
    //replace with creator price
    const value = itemPrice // should be as 0.005, 0.01 etc.
    sendTransaction({ to, value: parseEther(value) }) 
  } 



  return (
    <form onSubmit={submit}>

      <button 
        disabled={isLoading} 
        type="submit"
         className="btn btn-primary"
      >
        {isLoading ? 'Confirming...' : 'Send'} 
      </button>
      {hash && <div>Transaction Hash: {hash as any}</div>} 
      {isLoading && <div>Waiting for confirmation...</div>} 
    </form>
  )
}