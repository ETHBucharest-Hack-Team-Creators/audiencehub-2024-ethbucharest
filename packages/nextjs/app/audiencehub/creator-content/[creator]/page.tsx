"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ContentCard from "~~/components/ContentCard";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

type Creator = {
  name: string;
  description: string;
  price: number;
  creator: string;
  imgUrl: string;
  bannerURL: string;
};

interface CardProps {
  title: string;
  description: string;
  imgUrls: string[];
  id: string;
}

export default function Page({ params }: { params: { creator: string } }) {
  // Taking the creator address  and the user address
  const creatorAdress = params.creator;
  const { address } = useAccount();

  const [contentList, setContentList] = useState([]);
  const [creatorData, setCreatorData] = useState<Creator>();
  const [loading, setLoading] = useState(true);
  const { getCreatorContents, getCreatorData } = useFB();

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
        const content = await getCreatorContents(creatorAdress);
        setContentList(content);
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!creatorAdress) return;
    fetchData(creatorAdress);
  }, [address]);

  // const { data } = useScaffoldContractRead({
  //   contractName: "Sablier",
  //   functionName: "statusOf",
  //   args: [],
  //   watch: true,
  // });

  console.log("content list", contentList);
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
          <ul>
            {contentList.map((item: CardProps) => (
              <ContentCard key={item.id} title={item.title} description={item.description} imgUrls={item.imgUrls} />
            ))}
          </ul>
        </>
      ) : (
        <p>Creator not found!</p>
      )}
    </div>
  );
}
