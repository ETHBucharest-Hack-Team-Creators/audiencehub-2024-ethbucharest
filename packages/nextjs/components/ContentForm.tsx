"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ForwardIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

const ContentForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const { address } = useAccount();

  const { postContent, uploadImages } = useFB();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !picture) {
      alert("Title and content picture are required!");
      return;
    }
    let contentURL = [""];
    try {
      contentURL = await uploadImages([picture]);
    } catch (e) {
      console.error(e);
    }
    if (address) {
      try {
        postContent(address, title, description, contentURL[0]);
        alert("Content created successfully!");
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
            What content are you creating?
          </span>
          <ForwardIcon className="w-10 h-10 text-red-500" />
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
            placeholder="Insert a description or a link of your content"
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
            onChange={e => setPicture(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div className="pt-36">
          <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs rounded-3xl">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
