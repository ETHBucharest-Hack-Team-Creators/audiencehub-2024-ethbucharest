"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ContentCard from "~~/components/ContentCard";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

export default function Page({ params }: { params: { creator: string } }) {
  const [contentList, setContentList] = useState([]);
  const [creatorData, setCreatorData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();
  const { getCreatorContents, getCreatorData } = useFB();

  useEffect(() => {
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
        const creator = await getCreatorData(address);
        if (creator && creator.error) {
          notification.error(creator.error);
          throw new Error(creator.error);
        }
        setCreatorData(creator);
        const content = await getCreatorContents(address);
        console.log(content);
        setContentList(content);
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!address) return;
    fetchData(address);
  }, [address]);

  interface CardProps {
    title: string;
    description: string;
    imgUrls: string;
    id: string;
    // onClick: () => void;
  }

  if (loading) return <p>Loading</p>;

  console.log("content list", contentList);
  return (
    <div className="md-container max-w-screen-md md:mx-auto py-5 px-2">
      <h1 className="text-2xl">{creatorData.name}</h1>
      <ul>
        {contentList.map((item: CardProps) => (
          <ContentCard key={item.id} title={item.title} description={item.description} imgUrl={item.imgUrls[0]} />
        ))}
      </ul>
    </div>
  );
}
