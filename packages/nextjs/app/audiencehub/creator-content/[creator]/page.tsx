"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ContentCard from "~~/components/ContentCard";
import GatedContentList from "~~/components/GatedContentList";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

/* eslint-disable @next/next/no-img-element */

type Creator = {
  name: string;
  description: string;
  price: number;
  creator: string;
  imgUrl: string;
  bannerURL: string;
};

export default function Page({ params }: { params: { creator: string } }) {
  // Taking the creator address  and the user address
  const creatorAdress = params.creator;
  const { address } = useAccount();

  const [creatorData, setCreatorData] = useState<Creator>();
  const [loading, setLoading] = useState(true);
  const [sablierId, setSablierId] = useState();
  const { getCreatorData, getSablierId } = useFB();

  useEffect(() => {
    setLoading(true);
    const fetchData = async (creatorAdress: string) => {
      try {
        const creator = await getCreatorData(creatorAdress);
        if (creator && creator.error) {
          notification.error(creator.error);
          throw new Error(creator.error);
        }
        if (creator) {
          setCreatorData(creator);
        }
        // const content = await getCreatorContents(creatorAdress);
        // setContentList(content);
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchSubscriptionId = async (creator: string, fan: string) => {
      const data = await getSablierId(creator, fan);
      console.log("fetchSubscriptionStatus", data[0]);
      if (data && data.length > 0) {
        setSablierId(data[0].sablierId);
      }
    };

    if (!address || !params.creator) return;
    fetchSubscriptionId(params.creator, address);

    if (!creatorAdress) return;
    fetchData(creatorAdress);
  }, [address]);

  return (
    <div className="md-container max-w-screen-lg md:mx-auto py-7">
      {loading ? (
        <p>Loading...</p>
      ) : creatorData ? (
        <>
          <div className="flex flex-col gap-5 items-center">
            <img
              className="mask mask-hexagon"
              src={creatorData.imgUrl}
              alt="creator image"
              style={{
                width: 150,
                height: 150,
              }}
            />
            <h1 className="text-3xl">{creatorData.name}</h1>
          </div>
          <GatedContentList sablierId={sablierId} creatorAddress={params.creator} />
        </>
      ) : (
        <p>Creator not found!</p>
      )}
    </div>
  );
}
