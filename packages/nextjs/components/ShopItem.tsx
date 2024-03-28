import { parseUnits } from 'ethers/lib/utils';

const ShopItem = ({ createRequest, sendTransaction, address }: any) => {
  const handleClick = async () => {
    await createRequest();
    sendTransaction({ to: address as string, value: parseUnits("0.005", 18) });
  };

  return (
<div className="card w-72 bg-base-100 shadow-xl mx-5">
  <figure className="px-10 pt-10">
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
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
