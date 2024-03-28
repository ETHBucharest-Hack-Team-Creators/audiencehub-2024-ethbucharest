"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

const Page = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileBanner, setProfileBanner] = useState<File | null>(null);
  const { address } = useAccount();

  const { postCreator } = useFB();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !profilePicture) {
      alert("Name and profile picture are required!");
      return;
    }
    if (address) {
      try {
        postCreator(address, "", name, bio);
        alert("Profile created successfully!");
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
        <div className="pt-16">
          <button onClick={handleSubmit} className="btn btn-primary w-full max-w-xs rounded-3xl">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
