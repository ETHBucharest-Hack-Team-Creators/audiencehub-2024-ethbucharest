"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { CubeIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

const ItemForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [itemPicture, setItemPicture] = useState<File | null>(null);
  const { address } = useAccount();

  const { postOneItem, uploadImages } = useFB();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price <= 0 || !price) {
      notification.warning("Price must be greater than 0!");
      return;
    }
    if (!title || !itemPicture) {
      notification.warning("Title, price and item picture are required!");
      return;
    }
    let itemURL = [""];
    try {
      itemURL = await uploadImages([itemPicture]);
    } catch (e) {
      console.error(e);
    }
    if (address) {
      try {
        postOneItem(address, title, description, price, itemURL[0]);
        notification.success("Item created successfully!");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="my-7 px-96">
      <div className="flex flex-col gap-8 object-left-top bg-gray-100 pt-9 px-14 shadow-md rounded-lg">
        <div className="flex flex-row gap-3">
          <span className="mb-5 block text-lg font-medium leading-tight text-black sm:text-[30px] xl:text-[40px]">
            What do you want to sell?
          </span>
          <CubeIcon className="w-10 h-10 text-gray-500" />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Title
          </span>
          <input
            type="text"
            placeholder="Insert a title"
            className="input w-full max-w-xs rounded-3xl"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Description
          </span>
          <textarea
            className="textarea rounded-3xl"
            placeholder="Insert a description of your item"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Price
          </span>
          <input
            type="number"
            placeholder="Insert a price"
            className="input w-full max-w-xs rounded-3xl"
            value={price}
            onChange={e => setPrice(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Select a picture for it
          </span>
          <input
            type="file"
            className="file-input file-input-primary w-full max-w-xs rounded-3xl"
            onChange={e => setItemPicture(e.target.files ? e.target.files[0] : null)}
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
