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

  return (
    <div className="md-container max-w-screen-md md:mx-auto py-5 px-2 flex flex-col items-center">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <a href="/audiencehub/creator-home/new-content">
            <button className="btn btn-circle">
              <svg
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </a>
          {contentList.map((item: CardProps) => (
            <ContentCard key={item.id} title={item.title} description={item.description} imgUrls={item.imgUrls} />
          ))}
        </>
      )}
    </div>
  );
}
