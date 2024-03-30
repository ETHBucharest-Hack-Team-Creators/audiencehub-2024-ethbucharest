"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ContentCard from "~~/components/ContentCard";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface CardProps {
  title: string;
  description: string;
  imgUrls: string[];
  id: string;
}

export default function GatedContentList({ sablierId, creatorAddress }: any) {
  const [contentList, setContentList] = useState([]);
  const { getCreatorContents } = useFB();
  const [loading, setLoading] = useState(true);

  const { data: statusOf } = useScaffoldContractRead({
    contractName: "Sablier",
    functionName: "statusOf",
    args: [sablierId],
  });

  useEffect(() => {
    const fetchData = async () => {
      const content = await getCreatorContents(creatorAddress);
      setContentList(content);
    };

    setLoading(true);
    try {
      if (statusOf === 1) {
        fetchData();
      }
    } catch (error) {
      notification.error("Can't fetch data");
      console.log(error);
    } finally {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusOf]);

  if (loading) return <p>Loading...</p>;

  if (statusOf !== 1) return <p>Subscribe to have access to exclusive content</p>;

  return (
    <>
      {contentList.length === 0 && <p>No published content yet</p>}
      <ul>
        {contentList.map((item: CardProps) => (
          <ContentCard key={item.id} title={item.title} description={item.description} imgUrls={item.imgUrls} />
        ))}
      </ul>
    </>
  );
}
