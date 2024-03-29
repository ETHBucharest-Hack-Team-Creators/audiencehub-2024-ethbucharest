"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

const Page = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState(0);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileBanner, setProfileBanner] = useState<File | null>(null);
  const { address } = useAccount();

  const { postCreator, uploadImages } = useFB();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bio && bio.length > 200) {
      alert("Bio must be shorter than 200 letters!");
      return;
    }
    if (subscriptionPrice <= 0 || !subscriptionPrice) {
      alert("Subscription price must be greater than 0!");
      return;
    }
    if (!name || !profilePicture) {
      alert("Name and profile picture are required!");
      return;
    }
    let propicURL = [""];
    let bannerURL = [""];
    try {
      propicURL = await uploadImages([profilePicture]);
    } catch (e) {
      console.error(e);
    }
    if (profileBanner) {
      try {
        bannerURL = await uploadImages([profileBanner]);
      } catch (e) {
        console.error(e);
      }
    }
    if (address) {
      try {
        postCreator(address, propicURL[0], bannerURL[0], name, bio, subscriptionPrice);
        alert("Profile created successfully!");
        //window.location.reload();
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
            Create your profile
          </span>
          <SparklesIcon className="w-10 h-10 text-yellow-500" />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Name
          </span>
          <input
            type="text"
            placeholder="Insert your name here"
            className="input w-full max-w-xs rounded-3xl"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Bio
          </span>
          <textarea
            className="textarea rounded-3xl"
            placeholder="Insert a description of yourself"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Subscription price
          </span>
          <input
            type="number"
            placeholder="Insert your subscription price"
            className="input w-full max-w-xs rounded-3xl"
            value={subscriptionPrice}
            onChange={e => setSubscriptionPrice(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Select your profile picture
          </span>
          <input
            type="file"
            className="file-input file-input-primary w-full max-w-xs rounded-3xl"
            onChange={e => setProfilePicture(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div>
          <span className="mb-1 block text-lg font-medium leading-tight text-black sm:text-[22px] xl:text-[22px]">
            Select your banner
          </span>
          <input
            type="file"
            className="file-input file-input-primary w-full max-w-xs rounded-3xl"
            onChange={e => setProfileBanner(e.target.files ? e.target.files[0] : null)}
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

export default Page;
