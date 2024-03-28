import * as React from 'react'
import { 
  useSendTransaction, 
   
} from 'wagmi' 
import { parseEther } from 'viem' 
 
export function BuyNow({address} : any) {
  const { 
    data: hash, 
    isLoading, 
    sendTransaction 
  } = useSendTransaction() 

  

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    
    const to = address 
    const value = '0.001' // should be as 0.005, 0.01 etc.
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