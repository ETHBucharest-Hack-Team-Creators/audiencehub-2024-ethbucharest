/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useAccount } from "wagmi";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

const CreatorInfo: React.FC = () => {
  const [creatorData, setCreatorData] = useState({
    creator: "",
    imgUrl: "",
    bannerURL: "",
    name: "",
    description: "",
    price: 0,
  });
  const [loading, setLoading] = useState(true);
  const [imgFile, setImgFile] = useState<File>();

  const { address } = useAccount();
  const { getCreatorData, postCreator, uploadImages } = useFB();

  useEffect(() => {
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
        const creator = await getCreatorData(address);
        if (creator && creator.error) {
          // not registered
        } else {
          setCreatorData(creator);
        }
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!address) return;
    fetchData(address);
  }, [address]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreatorData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setImgUrl = (newUrl: string) => {
    setCreatorData((prevState: any) => ({
      ...prevState,
      imgUrl: newUrl,
    }));
  };

  const handleSubmit = async () => {
    if (!address) return;
    try {
      let downloadUrl = "";
      if (imgFile) {
        downloadUrl = (await uploadImages([imgFile]))[0];
      }
      await postCreator(address, downloadUrl, "", creatorData.name, creatorData.description, creatorData.price);
      if (!creatorData.creator) {
        notification.success("Profile created");
      } else {
        notification.success("Profile updated");
      }
      setCreatorData((prevState: any) => ({
        ...prevState,
        creator: address,
      }));
    } catch (error) {
      notification.error(String(error));
    }
  };

  if (loading) return <p>Loading</p>;

  return (
    <div className="flex container max-w-2xl flex-col pt-9 px-2 rounded-lg mx-auto my-4">
      {!creatorData.creator && (
        <div className="flex flex-row gap-3 justify-center">
          <span className="mb-5 block text-lg font-medium leading-tight sm:text-[30px] xl:text-[40px]">
            Create your profile
          </span>
          <SparklesIcon className="w-10 h-10 text-yellow-500" />
        </div>
      )}
      <Avatar imgUrl={creatorData.imgUrl} setImgUrl={setImgUrl} setImgFile={setImgFile} />
      <input
        type="text"
        name="name"
        placeholder="Your name ✎"
        className="input w-full mt-4 rounded-3xl input-ghost text-3xl text-center"
        value={creatorData.name}
        onChange={handleChange}
      />
      <textarea
        className="textarea rounded-3xl textarea-ghost text-center"
        name="description"
        placeholder="Insert a description of yourself"
        value={creatorData.description}
        onChange={handleChange}
      />
      <div className="flex flex-row flex-wrap my-3 justify-center">
        <label className="flex-1 flex items-center text-center">Subscription price</label>
        <input
          type="number"
          name="price"
          placeholder="10"
          className="input w-full max-w-xs rounded-3xl"
          value={creatorData.price}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSubmit} className="btn btn-primary w-full my-5 max-w-xs rounded-3xl self-center">
        {creatorData.creator ? "Update profile" : "Create profile"}
      </button>
    </div>
  );
};

export default CreatorInfo;
