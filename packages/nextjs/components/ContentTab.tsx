"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ContentCard from "~~/components/ContentCard";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

export default function ContentTab() {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();
  const { getCreatorContents } = useFB();

  useEffect(() => {
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  interface CardProps {
    title: string;
    description: string;
    imgUrls: string[];
    id: string;
    // onClick: () => void;
  }

  console.log("content list", contentList);
  return (
    <div className="md-container max-w-screen-md md:mx-auto py-5 px-2">
      {loading || !contentList ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {contentList.map((item: CardProps) => (
            <ContentCard key={item.id} title={item.title} description={item.description} imgUrls={item.imgUrls} />
          ))}
        </ul>
      )}
    </div>
  );
}
