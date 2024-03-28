"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

const ItemForm = () => {
  const [price, setPrice] = useState(0);
  const { address } = useAccount();

  const { updateCreator } = useFB();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price <= 0 || !price) {
      alert("Price must be greater than 0!");
      return;
    }
    try {
      if (address) {
        updateCreator(address, "price", price);
      }
      alert("Item created successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-7 px-96">
      <div className="flex flex-col gap-8 object-left-top bg-gray-100 pt-9 px-14 shadow-md rounded-lg">
        <div className="flex flex-row gap-3">
          <span className="mb-5 block text-lg font-medium leading-tight text-black sm:text-[30px] xl:text-[40px]">
            What is the new subscription price?
          </span>
          <CurrencyDollarIcon className="w-10 h-10 text-green-500" />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Price
          </span>
          <input
            type="number"
            placeholder="Insert a new price"
            className="input w-full max-w-xs rounded-3xl"
            value={price}
            onChange={e => setPrice(parseFloat(e.target.value))}
          />
        </div>
        <div className="pt-8 pb-9">
          <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs rounded-3xl">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
