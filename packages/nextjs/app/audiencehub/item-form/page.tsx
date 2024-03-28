"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { CubeIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemPicture, setItemPicture] = useState<File | null>(null);
  const { address } = useAccount();

  const { postOneItem, uploadImages } = useFB();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !itemPicture) {
      alert("Title and item picture are required!");
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
        postOneItem(address, title, description, itemURL[0]);
        alert("Item created successfully!");
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="my-5 px-96">
      <div className="flex flex-col gap-8 object-left-top min-h-screen bg-gray-100 pt-12 px-14 shadow-md rounded-lg">
        <div className="flex flex-row gap-3">
          <span className="mb-6 block text-lg font-medium leading-tight text-black sm:text-[30px] xl:text-[40px]">
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
            Select a picture for it
          </span>
          <input
            type="file"
            className="file-input file-input-primary w-full max-w-xs rounded-3xl"
            onChange={e => setItemPicture(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div className="pt-32">
          <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs rounded-3xl">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
