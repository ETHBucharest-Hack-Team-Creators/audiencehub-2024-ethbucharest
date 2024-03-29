import { parseUnits } from 'ethers/lib/utils';
import { useEffect } from 'react';
import { waitForTransaction } from '@wagmi/core'
import { notification } from '~~/utils/scaffold-eth';


const ShopItem = ({ createRequest, requestDataProps, title, image, description, price, itemId}: any) => {

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
  console.log(requestDataProps)
  },[requestDataProps])


  const handleClick = async () => {
    await createRequest("Item bought", true, 100, itemId, price);
   
 

    
  // if(isTxError) {
  //   console.log('tx error')
  // } else {




  // }
  }

  // useEffect(async () => {
  //   let declaredPayment;
  //   declaredPayment = notification.loading("Declaring sent payment");

  //  await requestDataProps.declareSentPayment('10', 'sent payment', {
  //     type: "ethereumAddress" as any,
  //     value: address as string,
  //   })
  //   notification.remove(declaredPayment);
  //   notification.success("Payment declared successfully")
  //   },[requestDataProps])
  

  return (
<div className="card w-72 bg-base-100 shadow-xl mx-5">
  <figure className="px-10 pt-10">
    <img src={image} alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">{title}</h2>
    <p>{description}</p>
    <p>{price}</p>
    <div className="card-actions">
    <button className="btn btn-primary" onClick={handleClick}>
      Request
    </button>
    </div>
  </div>
</div>
  );
};

export default ShopItem;
