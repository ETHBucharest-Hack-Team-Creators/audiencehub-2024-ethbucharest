

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
import { notification } from '~~/utils/scaffold-eth';
import { currencies } from "../config/currency"
import { storageChains } from "../config/storage-chains";
import { providers } from "ethers";
import { useState } from 'react';
import { zeroAddress } from 'viem';
 //creator's address
export function BuyNow({addressCreator, itemPrice} : any) {

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
    sendTransaction 
  } = useSendTransaction() 

  const { data: walletClient, isError } = useWalletClient();
  const [currency, setCurrency] = useState(currencies.keys().next().value);
  const [expectedAmount, setExpectedAmount] = useState("");

  const [status, setStatus] = React.useState(APP_STATUS.AWAITING_INPUT);
  const [storageChain, setStorageChain] = React.useState(
    storageChains.keys().next().value,
  );

  const [requestData, setRequestData] =
    React.useState<Types.IRequestDataWithEvents>();
//IT'S ABOUT PROVIDER

let provider;
if (process.env.WEB3_PROVIDER_URL === undefined) {
  // Connect to Metamask and other injected wallets
  provider = new providers.Web3Provider(window.ethereum as any);
} else {
  // Connect to your own Ethereum node or 3rd party node provider
  provider = new providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
}
  
  const web3SignatureProvider = new Web3SignatureProvider(provider);

  const {address} = useAccount()

  React.useEffect(() => {
    console.log(web3SignatureProvider)
   console.log(addressCreator, itemPrice)
  },[])




  const payeeIdentity = addressCreator as string;
const payerIdentity = addressCreator;
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
      expectedAmount: parseUnits(
   itemPrice,
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
    setStatus(APP_STATUS.PERSISTING_TO_IPFS);
    console.log("Persisting to IPFS")
    const request = await requestClient.createRequest(
      requestCreateParameters,
    );
   console.log("  Persisting on chain")
    setStatus(APP_STATUS.PERSISTING_ON_CHAIN);
    setRequestData(request.getData());
    const confirmedRequestData = await request.waitForConfirmation();
    console.log(" Request confirmed")
    setStatus(APP_STATUS.REQUEST_CONFIRMED);
    setRequestData(confirmedRequestData);
  } catch (err) {
    console.log("Error occurred")
    setStatus(APP_STATUS.ERROR_OCCURRED);
    console.log(err);
  }
}
function canSubmit() {
  return (
    status !== APP_STATUS.SUBMITTING &&
    !isError &&
    !isLoading &&
    storageChain.length > 0 &&
    // Payment Recipient is empty || isAddress
    (paymentRecipient.length === 0 ||
      (paymentRecipient.startsWith("0x") &&
        paymentRecipient.length === 42)) &&
    // Payer is empty || isAddress
    (payerIdentity && payerIdentity.length === 0 ||
      (payerIdentity && payerIdentity.startsWith("0x") && payerIdentity.length === 42)) &&
    expectedAmount.length > 0 &&
    currency.length > 0
  );
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!canSubmit()) {
    return;
  }
  setRequestData(undefined);
  setStatus(APP_STATUS.SUBMITTING);
  await createRequest();
}

function handleClear(_: React.MouseEvent<HTMLButtonElement>) {
  setRequestData(undefined);
  setStatus(APP_STATUS.AWAITING_INPUT);
}






  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
     await createRequest();
    const to = address 
    //replace with creator price
    const value = itemPrice // should be as 0.005, 0.01 etc.
    sendTransaction({ to, value: parseEther(value) } as any) 
  } 



  return (
    <>
    <form onSubmit={handleSubmit}>

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
    
    </>
  )
}